const express = require('express');
const router = express.Router();
const logger = require('../services/logger');
const { query } = require('../db/connection');

// GET /api/logs
router.get('/', async (req, res) => {
  try {
    const { level, module, limit = 100 } = req.query;

    let sql = 'SELECT * FROM audit_logs WHERE 1=1';
    const params = [];

    if (level && level !== 'ALL') {
      sql += ' AND level = ?';
      params.push(level);
    }

    if (module && module !== 'ALL') {
      sql += ' AND module = ?';
      params.push(module);
    }

    sql += ' ORDER BY id DESC LIMIT ?';
    params.push(parseInt(limit, 10));

    const dbLogs = await query(sql, params);
    const memoryLogs = logger.getRecentLogs();

    res.json({
      success: true,
      logs: dbLogs.length > 0 ? dbLogs : memoryLogs
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/logs/client (Client side UI events logging)
router.post('/client', (req, res) => {
  try {
    const { action, module = 'UI_INTERACTION', details, level = 'INFO', userId, userName } = req.body;
    logger.info(module, action, details, {
      userId,
      userName,
      ip: req.ip
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
