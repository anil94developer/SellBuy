const express = require('express');
const router = express.Router();
const { query } = require('../db/connection');
const logger = require('../services/logger');

// GET /api/notifications
router.get('/', async (req, res) => {
  try {
    const { userId, type } = req.query;
    if (!userId) return res.status(400).json({ success: false, message: 'User ID is required' });

    let targetUserId = userId;
    if (isNaN(userId)) {
      const cleanPhone = String(userId).replace(/\D/g, '').slice(-10);
      if (cleanPhone) {
        const u = (await query('SELECT id FROM users WHERE phone = ?', [cleanPhone]))[0];
        if (u) targetUserId = u.id;
      }
    }

    let sql = 'SELECT * FROM notifications WHERE user_id = ?';
    const params = [targetUserId];

    if (type && type !== 'all') {
      sql += ' AND type = ?';
      params.push(type);
    }

    sql += ' ORDER BY created_at DESC';

    const rawNotifs = await query(sql, params);
    const notifications = rawNotifs.map(n => ({
      id: String(n.id),
      title: n.title,
      message: n.message,
      type: n.type,
      read: Boolean(n.is_read),
      time: new Date(n.created_at).toLocaleDateString()
    }));
    const unreadCount = notifications.filter(n => !n.read).length;

    res.json({
      success: true,
      unreadCount,
      notifications
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/notifications/read-all
router.patch('/read-all', async (req, res) => {
  try {
    const { userId } = req.body;
    let targetUserId = userId;
    if (isNaN(userId)) {
      const cleanPhone = String(userId).replace(/\D/g, '').slice(-10);
      if (cleanPhone) {
        const u = (await query('SELECT id FROM users WHERE phone = ?', [cleanPhone]))[0];
        if (u) targetUserId = u.id;
      }
    }
    if (targetUserId) {
      await query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [targetUserId]);
    }
    res.json({ success: true, message: 'All notifications marked as read' });
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
