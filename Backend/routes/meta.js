const express = require('express');
const router = express.Router();
const { query } = require('../db/connection');
const redisCache = require('../services/redisCache');

// GET /api/meta/brands (Cached in Redis for 300s)
router.get('/brands', redisCache.middleware('meta:brands', 300), async (req, res) => {
  try {
    const showAll = req.query.all === '1' || req.query.includeInactive === '1';
    const sql = showAll
      ? 'SELECT * FROM brands ORDER BY is_popular DESC, name ASC'
      : 'SELECT * FROM brands WHERE is_active != 0 ORDER BY is_popular DESC, name ASC';
    const brands = await query(sql);
    res.json({ success: true, brands });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/meta/models
router.get('/models', async (req, res) => {
  try {
    const { brandId } = req.query;
    let sql = 'SELECT * FROM car_models';
    const params = [];
    if (brandId) {
      sql += ' WHERE brand_id = ?';
      params.push(brandId);
    }
    sql += ' ORDER BY name ASC';
    const models = await query(sql, params);
    res.json({ success: true, models });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/meta/cities (Cached in Redis for 300s)
router.get('/cities', redisCache.middleware('meta:cities', 300), async (req, res) => {
  try {
    const showAll = req.query.all === '1' || req.query.includeInactive === '1';
    const sql = showAll
      ? 'SELECT * FROM cities ORDER BY is_popular DESC, name ASC'
      : 'SELECT * FROM cities WHERE is_active != 0 ORDER BY is_popular DESC, name ASC';
    const cities = await query(sql);
    res.json({ success: true, cities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
