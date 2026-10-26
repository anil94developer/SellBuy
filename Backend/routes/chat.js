const express = require('express');
const router = express.Router();
const { query } = require('../db/connection');
const logger = require('../services/logger');
const socketService = require('../services/socketService');

// Helper to resolve user ID from number or phone
async function resolveUserId(val) {
  if (!val) return null;
  if (!isNaN(val)) return parseInt(val, 10);
  const cleanPhone = String(val).replace(/\D/g, '').slice(-10);
  if (cleanPhone) {
    const u = (await query('SELECT id FROM users WHERE phone = ?', [cleanPhone]))[0];
    if (u) return u.id;
  }
  return null;
}

// GET /api/chats (Conversations for a user with real DB messages)
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ success: false, message: 'User ID is required' });

    const targetUserId = await resolveUserId(userId) || userId;

    const sql = `
      SELECT ch.*,
             c.title AS car_title, c.price AS car_price, c.reg_city AS car_city,
             (SELECT image_url FROM car_images ci WHERE ci.listing_id = c.id ORDER BY ci.is_primary DESC, ci.id ASC LIMIT 1) AS car_image,
             buyer.name AS buyer_name, buyer.avatar AS buyer_avatar, buyer.phone AS buyer_phone,
             seller.name AS seller_name, seller.avatar AS seller_avatar, seller.phone AS seller_phone
      FROM chats ch
      JOIN car_listings c ON ch.listing_id = c.id
      JOIN users buyer ON ch.buyer_id = buyer.id
      JOIN users seller ON ch.seller_id = seller.id
      WHERE ch.buyer_id = ? OR ch.seller_id = ?
      ORDER BY ch.last_message_time DESC
    `;

    const chats = await query(sql, [targetUserId, targetUserId]);

    const formattedChats = [];
    for (const ch of chats) {
      const messages = await query(
        `SELECT m.*, u.name AS sender_name, u.avatar AS sender_avatar
         FROM chat_messages m
         JOIN users u ON m.sender_id = u.id
         WHERE m.chat_id = ?
         ORDER BY m.created_at ASC`,
        [ch.id]
      );

      const formattedMsgs = messages.map(m => ({
        id: String(m.id),
        senderId: String(m.sender_id),
        senderName: m.sender_name || (String(m.sender_id) === String(targetUserId) ? 'You' : 'Seller'),
        text: m.message_text,
        attachmentUrl: m.attachment_url,
        time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: String(m.sender_id) === String(targetUserId)
      }));

      const isCurrentSeller = String(ch.seller_id) === String(targetUserId);

      formattedChats.push({
        id: String(ch.id),
        chatId: ch.id,
        listingId: ch.listing_id,
        carId: String(ch.listing_id),
        carTitle: ch.car_title,
        carPrice: '₹ ' + Number(ch.car_price).toLocaleString('en-IN'),
        carImage: ch.car_image || '/assets/cars/creta.jpg',
        carLocation: ch.car_city || 'Jaipur, Rajasthan',
        sellerId: String(ch.seller_id),
        sellerName: ch.seller_name,
        sellerAvatar: ch.seller_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        sellerPhone: ch.seller_phone,
        buyerId: String(ch.buyer_id),
        buyerName: ch.buyer_name,
        buyerAvatar: ch.buyer_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        buyerPhone: ch.buyer_phone,
        isSeller: isCurrentSeller,
        mode: isCurrentSeller ? 'selling' : 'buying',
        lastMessage: ch.last_message || 'Chat started',
        lastMessageTime: ch.last_message_time ? new Date(ch.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
        unreadCount: 0,
        messages: formattedMsgs
      });
    }

    res.json({ success: true, chats: formattedChats });
  } catch (err) {
    logger.error('CHAT', 'GET_CHATS_ERROR', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/chats/:id/messages
router.get('/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    const targetUserId = (await resolveUserId(userId)) || userId || 0;

    const messages = await query(
      `SELECT m.*, u.name AS sender_name, u.avatar AS sender_avatar
       FROM chat_messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.chat_id = ?
       ORDER BY m.created_at ASC`,
      [id]
    );

    const formattedMsgs = messages.map(m => ({
      id: String(m.id),
      senderId: String(m.sender_id),
      senderName: m.sender_name,
      text: m.message_text,
      attachmentUrl: m.attachment_url,
      time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: String(m.sender_id) === String(targetUserId)
    }));

    // Chat info
    const chatRows = await query(
      `SELECT ch.*, c.title AS car_title, c.price AS car_price, c.reg_city AS car_city,
              (SELECT image_url FROM car_images ci WHERE ci.listing_id = c.id ORDER BY ci.is_primary DESC LIMIT 1) AS car_image,
              seller.id AS seller_id, seller.name AS seller_name, seller.avatar AS seller_avatar, seller.phone AS seller_phone,
              buyer.id AS buyer_id, buyer.name AS buyer_name, buyer.avatar AS buyer_avatar, buyer.phone AS buyer_phone
       FROM chats ch
       JOIN car_listings c ON ch.listing_id = c.id
       JOIN users seller ON ch.seller_id = seller.id
       JOIN users buyer ON ch.buyer_id = buyer.id
       WHERE ch.id = ?`,
      [id]
    );

    const ch = chatRows[0] || null;
    let chatInfo = null;
    if (ch) {
      chatInfo = {
        id: String(ch.id),
        chatId: ch.id,
        listingId: ch.listing_id,
        carId: String(ch.listing_id),
        carTitle: ch.car_title,
        carPrice: '₹ ' + Number(ch.car_price).toLocaleString('en-IN'),
        carImage: ch.car_image || '/assets/cars/creta.jpg',
        carLocation: ch.car_city,
        sellerId: String(ch.seller_id),
        sellerName: ch.seller_name,
        sellerAvatar: ch.seller_avatar,
        sellerPhone: ch.seller_phone,
        buyerId: String(ch.buyer_id),
        buyerName: ch.buyer_name,
        buyerAvatar: ch.buyer_avatar,
        buyerPhone: ch.buyer_phone,
        lastMessage: ch.last_message,
        messages: formattedMsgs
      };
    }

    res.json({
      success: true,
      chat: chatInfo,
      messages: formattedMsgs
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/chats/start (Initiate chat on car listing)
router.post('/start', async (req, res) => {
  try {
    let { buyerId, sellerId, listingId, initialMessage } = req.body;
    if (!buyerId || !listingId) {
      return res.status(400).json({ success: false, message: 'Missing chat initiation parameters' });
    }

    const resolvedBuyerId = await resolveUserId(buyerId) || 1;
    let resolvedSellerId = await resolveUserId(sellerId);

    // If sellerId not passed or missing, lookup seller from car_listings
    if (!resolvedSellerId) {
      const carRow = (await query('SELECT user_id FROM car_listings WHERE id = ?', [listingId]))[0];
      if (carRow) resolvedSellerId = carRow.user_id;
    }
    if (!resolvedSellerId) resolvedSellerId = 1;

    const buyer = (await query('SELECT status FROM users WHERE id = ?', [resolvedBuyerId]))[0];
    if (buyer && buyer.status === 'blocked') {
      return res.status(403).json({ success: false, isBlocked: true, message: 'Your account has been suspended by administrator.' });
    }

    if (parseInt(resolvedBuyerId, 10) === parseInt(resolvedSellerId, 10)) {
      return res.status(400).json({ success: false, message: 'You cannot chat with yourself on your own listing' });
    }

    // Check existing chat
    let chat = (await query(
      'SELECT id FROM chats WHERE listing_id = ? AND buyer_id = ? AND seller_id = ?',
      [listingId, resolvedBuyerId, resolvedSellerId]
    ))[0];

    let chatId;
    const defaultMsg = initialMessage || 'Hi, is this car available for inspection?';

    if (chat) {
      chatId = chat.id;
    } else {
      const createRes = await query(
        'INSERT INTO chats (listing_id, buyer_id, seller_id, last_message) VALUES (?, ?, ?, ?)',
        [listingId, resolvedBuyerId, resolvedSellerId, defaultMsg]
      );
      chatId = createRes.insertId;

      // Add initial greeting message
      await query(
        'INSERT INTO chat_messages (chat_id, sender_id, message_text) VALUES (?, ?, ?)',
        [chatId, resolvedBuyerId, defaultMsg]
      );

      // Notification to seller
      await query(
        'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
        [resolvedSellerId, 'New Buyer Inquiry', `A buyer is interested in your vehicle listing!`, 'messages']
      );

      logger.info('CHAT', 'CHAT_STARTED', `Chat #${chatId} started by buyer #${resolvedBuyerId} with seller #${resolvedSellerId}`);
    }

    // Fetch full conversation object
    const ch = (await query(
      `SELECT ch.*, c.title AS car_title, c.price AS car_price, c.reg_city AS car_city,
              (SELECT image_url FROM car_images ci WHERE ci.listing_id = c.id ORDER BY ci.is_primary DESC LIMIT 1) AS car_image,
              seller.id AS seller_id, seller.name AS seller_name, seller.avatar AS seller_avatar, seller.phone AS seller_phone,
              buyer.id AS buyer_id, buyer.name AS buyer_name, buyer.avatar AS buyer_avatar, buyer.phone AS buyer_phone
       FROM chats ch
       JOIN car_listings c ON ch.listing_id = c.id
       JOIN users seller ON ch.seller_id = seller.id
       JOIN users buyer ON ch.buyer_id = buyer.id
       WHERE ch.id = ?`,
      [chatId]
    ))[0];

    const messages = await query(
      `SELECT m.*, u.name AS sender_name, u.avatar AS sender_avatar
       FROM chat_messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.chat_id = ?
       ORDER BY m.created_at ASC`,
      [chatId]
    );

    const formattedMsgs = messages.map(m => ({
      id: String(m.id),
      senderId: String(m.sender_id),
      senderName: m.sender_name || 'You',
      text: m.message_text,
      attachmentUrl: m.attachment_url,
      time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: String(m.sender_id) === String(resolvedBuyerId)
    }));

    const conversation = {
      id: String(ch.id),
      chatId: ch.id,
      listingId: ch.listing_id,
      carId: String(ch.listing_id),
      carTitle: ch.car_title,
      carPrice: '₹ ' + Number(ch.car_price).toLocaleString('en-IN'),
      carImage: ch.car_image || '/assets/cars/creta.jpg',
      carLocation: ch.car_city,
      sellerId: String(ch.seller_id),
      sellerName: ch.seller_name,
      sellerAvatar: ch.seller_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      sellerPhone: ch.seller_phone,
      buyerId: String(ch.buyer_id),
      buyerName: ch.buyer_name,
      buyerAvatar: ch.buyer_avatar,
      isSeller: false,
      mode: 'buying',
      lastMessage: ch.last_message,
      lastMessageTime: 'Just now',
      messages: formattedMsgs
    };

    // Broadcast chat initiation via socket
    socketService.sendToUser(resolvedSellerId, {
      type: 'chat_started',
      chat: conversation
    });

    res.json({ success: true, chatId, conversation });
  } catch (err) {
    logger.error('CHAT', 'START_CHAT_ERROR', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/chats/:id/send
router.post('/:id/send', async (req, res) => {
  try {
    const { id } = req.params;
    let { senderId, messageText, attachmentUrl } = req.body;

    if (!senderId || (!messageText && !attachmentUrl)) {
      return res.status(400).json({ success: false, message: 'Sender and message text or image are required' });
    }

    const resolvedSenderId = (await resolveUserId(senderId)) || senderId;

    const sender = (await query('SELECT status, name, avatar FROM users WHERE id = ?', [resolvedSenderId]))[0];
    if (sender && sender.status === 'blocked') {
      return res.status(403).json({ success: false, isBlocked: true, message: 'Your account has been suspended by administrator.' });
    }

    const textToSave = messageText ? messageText.trim() : 'Sent an attachment';

    const result = await query(
      'INSERT INTO chat_messages (chat_id, sender_id, message_text, attachment_url) VALUES (?, ?, ?, ?)',
      [id, resolvedSenderId, textToSave, attachmentUrl || null]
    );

    // Update last message in chat
    await query(
      'UPDATE chats SET last_message = ?, last_message_time = NOW() WHERE id = ?',
      [textToSave, id]
    );

    const formattedMessage = {
      id: String(result.insertId),
      senderId: String(resolvedSenderId),
      senderName: sender?.name || 'You',
      text: textToSave,
      attachmentUrl: attachmentUrl || null,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    logger.info('CHAT', 'MESSAGE_SENT', `Chat #${id} message sent by user #${resolvedSenderId}`, {
      userId: resolvedSenderId
    });

    // Real-Time Socket Broadcast to Room & Participants
    socketService.broadcastToRoom(`chat_${id}`, {
      type: 'new_message',
      chatId: String(id),
      message: formattedMessage
    });

    res.json({ success: true, message: formattedMessage });
  } catch (err) {
    logger.error('CHAT', 'SEND_MESSAGE_ERROR', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
