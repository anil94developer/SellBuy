const express = require('express');
const router = express.Router();
const { query } = require('../db/connection');
const logger = require('../services/logger');

// GET /api/chats (Conversations for a user)
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ success: false, message: 'User ID is required' });

    const sql = `
      SELECT ch.*,
             c.title AS car_title, c.price AS car_price, c.reg_city AS car_city,
             (SELECT image_url FROM car_images ci WHERE ci.listing_id = c.id LIMIT 1) AS car_image,
             buyer.name AS buyer_name, buyer.avatar AS buyer_avatar,
             seller.name AS seller_name, seller.avatar AS seller_avatar, seller.phone AS seller_phone
      FROM chats ch
      JOIN car_listings c ON ch.listing_id = c.id
      JOIN users buyer ON ch.buyer_id = buyer.id
      JOIN users seller ON ch.seller_id = seller.id
      WHERE ch.buyer_id = ? OR ch.seller_id = ?
      ORDER BY ch.last_message_time DESC
    `;

    const chats = await query(sql, [userId, userId]);
    chats.forEach(ch => {
      if (!ch.car_image) ch.car_image = '/assets/cars/creta.jpg';
    });

    res.json({ success: true, chats });
  } catch (err) {
    logger.error('CHAT', 'GET_CHATS_ERROR', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/chats/:id/messages
router.get('/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;

    const messages = await query(
      `SELECT m.*, u.name AS sender_name, u.avatar AS sender_avatar
       FROM chat_messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.chat_id = ?
       ORDER BY m.created_at ASC`,
      [id]
    );

    // Chat info
    const chatRows = await query(
      `SELECT ch.*, c.title AS car_title, c.price AS car_price, c.reg_city AS car_city,
              (SELECT image_url FROM car_images ci WHERE ci.listing_id = c.id LIMIT 1) AS car_image,
              seller.id AS seller_id, seller.name AS seller_name, seller.avatar AS seller_avatar, seller.phone AS seller_phone,
              buyer.id AS buyer_id, buyer.name AS buyer_name, buyer.avatar AS buyer_avatar
       FROM chats ch
       JOIN car_listings c ON ch.listing_id = c.id
       JOIN users seller ON ch.seller_id = seller.id
       JOIN users buyer ON ch.buyer_id = buyer.id
       WHERE ch.id = ?`,
      [id]
    );

    const chatInfo = chatRows[0] || null;
    if (chatInfo && !chatInfo.car_image) chatInfo.car_image = '/assets/cars/creta.jpg';

    res.json({
      success: true,
      chat: chatInfo,
      messages
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/chats/start (Initiate chat on car listing)
router.post('/start', async (req, res) => {
  try {
    const { buyerId, sellerId, listingId, initialMessage } = req.body;
    if (!buyerId || !sellerId || !listingId) {
      return res.status(400).json({ success: false, message: 'Missing chat initiation parameters' });
    }

    const buyer = (await query('SELECT status FROM users WHERE id = ?', [buyerId]))[0];
    if (buyer && buyer.status === 'blocked') {
      return res.status(403).json({ success: false, isBlocked: true, message: 'Your account has been suspended by administrator.' });
    }

    if (parseInt(buyerId, 10) === parseInt(sellerId, 10)) {
      return res.status(400).json({ success: false, message: 'You cannot chat with yourself on your own listing' });
    }

    // Check existing
    let chat = (await query(
      'SELECT id FROM chats WHERE listing_id = ? AND buyer_id = ? AND seller_id = ?',
      [listingId, buyerId, sellerId]
    ))[0];

    let chatId;
    if (chat) {
      chatId = chat.id;
    } else {
      const createRes = await query(
        'INSERT INTO chats (listing_id, buyer_id, seller_id, last_message) VALUES (?, ?, ?, ?)',
        [listingId, buyerId, sellerId, initialMessage || 'Hi, is this car available?']
      );
      chatId = createRes.insertId;

      // Add initial greeting message
      await query(
        'INSERT INTO chat_messages (chat_id, sender_id, message_text) VALUES (?, ?, ?)',
        [chatId, buyerId, initialMessage || 'Hi, is this car available?']
      );

      // Notification to seller
      await query(
        'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
        [sellerId, 'New Buyer Inquiry', `A buyer is interested in your listing!`, 'messages']
      );

      logger.info('CHAT', 'CHAT_STARTED', `Chat #${chatId} started by buyer #${buyerId} with seller #${sellerId}`);
    }

    res.json({ success: true, chatId });
  } catch (err) {
    logger.error('CHAT', 'START_CHAT_ERROR', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/chats/:id/send
router.post('/:id/send', async (req, res) => {
  try {
    const { id } = req.params;
    const { senderId, messageText, attachmentUrl } = req.body;

    if (!senderId || (!messageText && !attachmentUrl)) {
      return res.status(400).json({ success: false, message: 'Sender and message text or image are required' });
    }

    const sender = (await query('SELECT status FROM users WHERE id = ?', [senderId]))[0];
    if (sender && sender.status === 'blocked') {
      return res.status(403).json({ success: false, isBlocked: true, message: 'Your account has been suspended by administrator.' });
    }

    const result = await query(
      'INSERT INTO chat_messages (chat_id, sender_id, message_text, attachment_url) VALUES (?, ?, ?, ?)',
      [id, senderId, messageText || 'Sent an attachment', attachmentUrl || null]
    );

    // Update last message in chat
    await query(
      'UPDATE chats SET last_message = ?, last_message_time = NOW() WHERE id = ?',
      [messageText || 'Sent an attachment', id]
    );

    // Fetch newly created message
    const newMessage = (await query('SELECT * FROM chat_messages WHERE id = ?', [result.insertId]))[0];

    logger.info('CHAT', 'MESSAGE_SENT', `Chat #${id} message sent by user #${senderId}`, {
      userId: senderId
    });

    res.json({ success: true, message: newMessage });
  } catch (err) {
    logger.error('CHAT', 'SEND_MESSAGE_ERROR', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
