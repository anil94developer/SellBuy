const express = require('express');
const router = express.Router();
const { query } = require('../db/connection');
const logger = require('../services/logger');

// GET /api/notifications
router.get('/', async (req, res) => {
  try {
    const { userId, type } = req.query;
    if (!userId) return res.status(400).json({ success: false, message: 'User ID is required' });

    let sql = 'SELECT * FROM notifications WHERE user_id = ?';
    const params = [userId];

    if (type && type !== 'all') {
      sql += ' AND type = ?';
      params.push(type);
    }

    sql += ' ORDER BY created_at DESC';

    const notifications = await query(sql, params);
    const unreadCount = notifications.filter(n => !n.is_read).length;

    res.json({
      success: true,
      unreadCount,
      notifications
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    await query('UPDATE notifications SET is_read = 1 WHERE id = ?', [id]);
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/notifications/broadcast
router.post('/broadcast', async (req, res) => {
  try {
    const { title, message, type = 'system' } = req.body;
    if (!title || !message) return res.status(400).json({ success: false, message: 'Title and message are required' });

    const users = await query('SELECT id FROM users');
    for (const u of users) {
      await query(
        'INSERT INTO notifications (user_id, title, message, type, is_read) VALUES (?, ?, ?, ?, 0)',
        [u.id, title, message, type]
      );
    }

    logger.admin('NOTIFICATION_BROADCAST', `Sent broadcast notification to ${users.length} users: "${title}"`);
    res.json({ success: true, message: `Notification broadcasted to ${users.length} users` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
