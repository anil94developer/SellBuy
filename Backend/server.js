require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const logger = require('./services/logger');
const { getPool } = require('./db/connection');
const { seedDatabase } = require('./db/seed');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for standalone ports (e.g. 3000, 4000, 8000, file://)
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Directories
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const appDir = path.join(__dirname, '..', 'Application');
const webDir = path.join(__dirname, '..', 'Website');
const adminDir = path.join(__dirname, '..', 'Admin');

// Static uploads & shared assets
app.use('/uploads', express.static(uploadsDir));
app.use('/assets', express.static(path.join(appDir, 'assets')));

// Serve the 3 Frontend Folders directly
app.use('/app', express.static(appDir));
app.use('/application', express.static(appDir));

app.use('/web', express.static(webDir));
app.use('/website', express.static(webDir));

app.use('/admin', express.static(adminDir));

// Image Uploads via Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, 'car-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Upload Endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  logger.car('IMAGE_UPLOAD', `Uploaded image: ${fileUrl}`);
  res.json({ success: true, url: fileUrl });
});

// Request Logging Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.originalUrl.startsWith('/api') && !req.originalUrl.includes('/api/logs')) {
      logger.info('HTTP', req.method, `${req.originalUrl} [${res.statusCode}] - ${duration}ms`, {
        ip: req.ip
      });
    }
  });
  next();
});

// Mount API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cars', require('./routes/cars'));
app.use('/api/meta', require('./routes/meta'));
app.use('/api/chats', require('./routes/chat'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/logs', require('./routes/logs'));

const redisCache = require('./services/redisCache');
app.get('/api/redis/status', (req, res) => {
  res.json({
    success: true,
    redis: redisCache.getStatus(),
    timestamp: new Date().toISOString()
  });
});

app.post('/api/redis/flush', async (req, res) => {
  await redisCache.flush();
  res.json({ success: true, message: 'Redis & memory caches purged successfully' });
});

// Health & System Info API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    app: process.env.APP_NAME || 'SellBuy',
    db: process.env.DB_NAME || 'sellbuyer',
    port: PORT,
    folders: {
      application: '/app',
      website: '/web',
      admin: '/admin',
      api: '/api'
    },
    timestamp: new Date().toISOString()
  });
});

// Root Portal Hub: Easy 1-click launcher for all 3 apps
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SellBuy - Platform Ecosystem Hub</title>
      <link rel="icon" type="image/jpeg" href="/assets/logo.jpg">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
      <style>
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #0a0e17;
          color: #f1f5f9;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .hub-card {
          max-width: 960px;
          width: 100%;
          background: #111827;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
          text-align: center;
        }
        .hub-logo {
          width: 70px;
          height: 70px;
          border-radius: 18px;
          margin-bottom: 16px;
          box-shadow: 0 0 30px rgba(37, 99, 235, 0.5);
        }
        .hub-title {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }
        .hub-subtitle {
          color: #94a3b8;
          font-size: 15px;
          margin-bottom: 36px;
        }
        .modules-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 36px;
          text-align: left;
        }
        .mod-card {
          background: #1e293b;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 24px;
          text-decoration: none;
          color: inherit;
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .mod-card:hover {
          transform: translateY(-4px);
          border-color: #3b82f6;
          box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
        }
        .mod-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          margin-bottom: 16px;
        }
        .ic-app { background: rgba(37, 99, 235, 0.2); color: #60a5fa; }
        .ic-web { background: rgba(16, 185, 129, 0.2); color: #34d399; }
        .ic-adm { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
        .mod-name { font-size: 18px; font-weight: 700; margin-bottom: 6px; }
        .mod-desc { font-size: 12.5px; color: #94a3b8; line-height: 1.5; margin-bottom: 18px; }
        .mod-btn {
          font-size: 13px;
          font-weight: 600;
          color: #60a5fa;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="hub-card">
        <img src="/assets/logo.jpg" alt="SellBuy" class="hub-logo">
        <h1 class="hub-title">SellBuy Marketplace Platform</h1>
        <p class="hub-subtitle">Choose an application module to open. All 4 folders are configured and synchronized with MySQL <code>sellbuyer</code>.</p>

        <div class="modules-grid">
          <a href="/app" class="mod-card">
            <div>
              <div class="mod-icon ic-app"><i class="fa-solid fa-mobile-screen"></i></div>
              <div class="mod-name">📁 Application</div>
              <div class="mod-desc">Customer Mobile App (Buyer & Seller) with 20+ screens, device mockup frame, Sell wizard, Chat & Hindi/English localization.</div>
            </div>
            <div class="mod-btn">Launch Mobile App <i class="fa-solid fa-arrow-right"></i></div>
          </a>

          <a href="/web" class="mod-card">
            <div>
              <div class="mod-icon ic-web"><i class="fa-solid fa-globe"></i></div>
              <div class="mod-name">📁 Website</div>
              <div class="mod-desc">Customer Desktop/Web Portal with mega search, popular brands showcase, certified cars grid, EMI calculator & Sell online.</div>
            </div>
            <div class="mod-btn">Launch Website <i class="fa-solid fa-arrow-right"></i></div>
          </a>

          <a href="/admin" class="mod-card">
            <div>
              <div class="mod-icon ic-adm"><i class="fa-solid fa-gauge-high"></i></div>
              <div class="mod-name">📁 Admin</div>
              <div class="mod-desc">Dedicated Back-Office Console: Listings approvals queue, user moderation & blocking, brands/cities manager & real-time audit logs.</div>
            </div>
            <div class="mod-btn">Launch Admin Panel <i class="fa-solid fa-arrow-right"></i></div>
          </a>
        </div>

        <div style="display: flex; justify-content: center; align-items: center; gap: 20px;">
          <div class="status-badge">
            <span style="width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></span>
            MySQL "sellbuyer" Database Online
          </div>
          <a href="/api/health" style="color: #94a3b8; font-size: 12px; text-decoration: none;">
            <i class="fa-solid fa-server"></i> API Health: Port ${PORT}
          </a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Fallback to Application for unmatched paths
app.use((req, res) => {
  res.sendFile(path.join(appDir, 'index.html'));
});

// Start Server & verify database
async function startServer() {
  try {
    await getPool();
    await seedDatabase();
  } catch (err) {
    console.error('[STARTUP WARNING] DB initial connection warning:', err.message);
  }

  app.listen(PORT, () => {
    logger.info('SYSTEM', 'SERVER_START', `SellBuy Server running on http://localhost:${PORT}`);
    console.log(`=======================================================`);
    console.log(`🚗 SellBuy Hub running on: http://localhost:${PORT}`);
    console.log(`📱 1. Application: http://localhost:${PORT}/app`);
    console.log(`🌐 2. Website:     http://localhost:${PORT}/web`);
    console.log(`🛡️ 3. Admin:       http://localhost:${PORT}/admin`);
    console.log(`📦 4. Backend API: http://localhost:${PORT}/api`);
    console.log(`💾 Database: MySQL "sellbuyer" (via .env)`);
    console.log(`=======================================================`);
  });
}

startServer();
