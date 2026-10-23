const { createClient } = require('redis');
const logger = require('./logger');

class RedisCacheManager {
  constructor() {
    this.client = null;
    this.isRedisConnected = false;
    this.memoryCache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      mode: 'INITIALIZING'
    };

    this.init();
  }

  async init() {
    const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
    try {
      this.client = createClient({
        url: redisUrl,
        socket: {
          connectTimeout: 2000,
          reconnectStrategy: (retries) => {
            if (retries > 3) {
              return false; // Stop reconnecting and stay on memory fallback
            }
            return Math.min(retries * 200, 1000);
          }
        }
      });

      this.client.on('error', (err) => {
        if (!this.isRedisConnected) {
          // Silent fallback on initial failure
          this.stats.mode = 'IN_MEMORY_FALLBACK';
        } else {
          console.warn('[Redis] Connection error, switching to Memory Cache:', err.message);
          this.isRedisConnected = false;
          this.stats.mode = 'IN_MEMORY_FALLBACK';
        }
      });

      this.client.on('connect', () => {
        this.isRedisConnected = true;
        this.stats.mode = 'REDIS_CONNECTED';
        logger.info('REDIS', 'CONNECTED', `Redis cache server connected at ${redisUrl}`);
      });

      this.client.on('ready', () => {
        this.isRedisConnected = true;
        this.stats.mode = 'REDIS_ONLINE';
      });

      await this.client.connect().catch(() => {
        this.isRedisConnected = false;
        this.stats.mode = 'IN_MEMORY_FALLBACK';
        logger.info('REDIS', 'FALLBACK', 'Redis service offline. Fast in-memory caching activated.');
      });
    } catch {
      this.isRedisConnected = false;
      this.stats.mode = 'IN_MEMORY_FALLBACK';
    }
  }

  // Get cached value
  async get(key) {
    try {
      if (this.isRedisConnected && this.client) {
        const data = await this.client.get(key);
        if (data) {
          this.stats.hits++;
          return JSON.parse(data);
        }
      } else {
        const item = this.memoryCache.get(key);
        if (item && item.expiry > Date.now()) {
          this.stats.hits++;
          return item.data;
        } else if (item) {
          this.memoryCache.delete(key);
        }
      }
    } catch (e) {
      console.warn('[RedisCache.get error]', e.message);
    }
    this.stats.misses++;
    return null;
  }

  // Set cached value with TTL (in seconds)
  async set(key, value, ttlSeconds = 120) {
    try {
      this.stats.sets++;
      if (this.isRedisConnected && this.client) {
        await this.client.set(key, JSON.stringify(value), { EX: ttlSeconds });
      } else {
        this.memoryCache.set(key, {
          data: value,
          expiry: Date.now() + (ttlSeconds * 1000)
        });

        // Memory cleanup limit (prevent unbounded growth)
        if (this.memoryCache.size > 2000) {
          const firstKey = this.memoryCache.keys().next().value;
          this.memoryCache.delete(firstKey);
        }
      }
      return true;
    } catch (e) {
      console.warn('[RedisCache.set error]', e.message);
      return false;
    }
  }

  // Delete single key
  async del(key) {
    try {
      if (this.isRedisConnected && this.client) {
        await this.client.del(key);
      } else {
        this.memoryCache.delete(key);
      }
    } catch (e) {
      console.warn('[RedisCache.del error]', e.message);
    }
  }

  // Invalidate by pattern (e.g. "cars:*")
  async delByPattern(pattern) {
    try {
      if (this.isRedisConnected && this.client) {
        const keys = await this.client.keys(pattern);
        if (keys && keys.length > 0) {
          await this.client.del(keys);
        }
      } else {
        const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
        for (const k of this.memoryCache.keys()) {
          if (regex.test(k)) {
            this.memoryCache.delete(k);
          }
        }
      }
    } catch (e) {
      console.warn('[RedisCache.delByPattern error]', e.message);
    }
  }

  // Flush all cache
  async flush() {
    try {
      if (this.isRedisConnected && this.client) {
        await this.client.flushAll();
      }
      this.memoryCache.clear();
      this.stats.hits = 0;
      this.stats.misses = 0;
      this.stats.sets = 0;
    } catch (e) {
      console.warn('[RedisCache.flush error]', e.message);
    }
  }

  // Get status
  getStatus() {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? ((this.stats.hits / totalRequests) * 100).toFixed(1) + '%' : '0%';
    return {
      connected: this.isRedisConnected,
      mode: this.stats.mode,
      memoryEntries: this.memoryCache.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate,
      sets: this.stats.sets
    };
  }

  // Express middleware generator
  middleware(keyPrefix, ttlSeconds = 60) {
    return async (req, res, next) => {
      // Only cache GET requests
      if (req.method !== 'GET') return next();

      const queryString = Object.keys(req.query).sort().map(k => `${k}=${req.query[k]}`).join('&');
      const cacheKey = `${keyPrefix}:${req.path}:${queryString}`;

      const cachedData = await this.get(cacheKey);
      if (cachedData) {
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('X-Cache-Engine', this.isRedisConnected ? 'Redis' : 'Memory-LRU');
        return res.json(cachedData);
      }

      // Intercept res.json to store into cache
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        res.setHeader('X-Cache', 'MISS');
        res.setHeader('X-Cache-Engine', this.isRedisConnected ? 'Redis' : 'Memory-LRU');
        if (res.statusCode >= 200 && res.statusCode < 300) {
          this.set(cacheKey, body, ttlSeconds).catch(() => {});
        }
        return originalJson(body);
      };

      next();
    };
  }
}

const redisCache = new RedisCacheManager();
module.exports = redisCache;
