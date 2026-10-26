const crypto = require('crypto');
const { query } = require('../db/connection');
const logger = require('./logger');

/**
 * SellBuy Real-Time WebSocket Server (RFC 6455 Compliant)
 * Zero external dependencies - uses Node.js standard http & crypto libraries.
 * Handles rooms, user presence, typing indicators, and instant message broadcast.
 */
class SocketService {
  constructor() {
    this.clients = new Map(); // socketId -> { socket, userId, userName, rooms: Set, isAlive: boolean }
    this.userSockets = new Map(); // userId -> Set of socketIds
    this.rooms = new Map(); // roomName -> Set of socketIds
    this.heartbeatInterval = null;
  }

  /**
   * Attach to standard Node.js HTTP server
   */
  init(server) {
    server.on('upgrade', (req, socket, head) => {
      const url = req.url || '';
      if (!url.startsWith('/ws') && !url.startsWith('/socket')) {
        return; // Ignore other upgrade requests
      }

      const key = req.headers['sec-websocket-key'];
      if (!key) {
        socket.destroy();
        return;
      }

      // 1. Perform RFC 6455 WebSocket Handshake
      const acceptKey = crypto
        .createHash('sha1')
        .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
        .digest('base64');

      const headers = [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Accept: ${acceptKey}`,
        '\r\n'
      ];

      socket.write(headers.join('\r\n'));

      // 2. Register Client Connection
      const socketId = 'sock_' + Math.random().toString(36).substring(2, 10);
      const client = {
        id: socketId,
        socket,
        userId: null,
        userName: null,
        rooms: new Set(),
        isAlive: true,
        buffer: Buffer.alloc(0)
      };

      this.clients.set(socketId, client);

      // Extract optional userId from query string e.g. /ws/chat?userId=1&name=Rakesh
      try {
        const parsedUrl = new URL(url, 'http://localhost');
        const qUserId = parsedUrl.searchParams.get('userId');
        const qName = parsedUrl.searchParams.get('name');
        if (qUserId) {
          this.bindUser(socketId, qUserId, qName || 'User');
        }
      } catch (e) {}

      logger.info('SOCKET', 'CLIENT_CONNECTED', `Client connected: ${socketId} (Total: ${this.clients.size})`);

      // 3. Listen for Incoming Frames
      socket.on('data', (chunk) => {
        client.buffer = Buffer.concat([client.buffer, chunk]);
        this.processBuffer(client);
      });

      socket.on('close', () => {
        this.cleanupClient(socketId);
      });

      socket.on('error', (err) => {
        logger.warn('SOCKET', 'SOCKET_ERROR', `${socketId}: ${err.message}`);
        this.cleanupClient(socketId);
      });

      // Send initial welcome message
      this.send(socket, {
        type: 'connected',
        socketId,
        serverTime: new Date().toISOString(),
        onlineCount: this.clients.size
      });
    });

    // Start 30s heartbeat to drop stale connections
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = setInterval(() => {
      for (const [id, client] of this.clients.entries()) {
        if (!client.isAlive) {
          try { client.socket.destroy(); } catch (e) {}
          this.cleanupClient(id);
          continue;
        }
        client.isAlive = false;
        try {
          // Send WebSocket Ping Frame (0x89)
          client.socket.write(Buffer.from([0x89, 0x00]));
        } catch (e) {
          this.cleanupClient(id);
        }
      }
    }, 30000);

    logger.info('SOCKET', 'SERVER_INITIALIZED', 'SellBuy WebSocket server listening on /ws/chat');
  }

  /**
   * Process and decode RFC 6455 frames
   */
  processBuffer(client) {
    let buf = client.buffer;
    while (buf.length >= 2) {
      const byte0 = buf[0];
      const byte1 = buf[1];
      const opcode = byte0 & 0x0f;
      const isMasked = (byte1 & 0x80) !== 0;
      let payloadLen = byte1 & 0x7f;
      let offset = 2;

      if (payloadLen === 126) {
        if (buf.length < 4) return;
        payloadLen = buf.readUInt16BE(2);
        offset = 4;
      } else if (payloadLen === 127) {
        if (buf.length < 10) return;
        payloadLen = Number(buf.readBigUInt64BE(2));
        offset = 10;
      }

      const maskSize = isMasked ? 4 : 0;
      if (buf.length < offset + maskSize + payloadLen) {
        return; // Frame incomplete, wait for more data
      }

      let payload = buf.slice(offset + maskSize, offset + maskSize + payloadLen);

      if (isMasked) {
        const mask = buf.slice(offset, offset + 4);
        const unmasked = Buffer.alloc(payloadLen);
        for (let i = 0; i < payloadLen; i++) {
          unmasked[i] = payload[i] ^ mask[i % 4];
        }
        payload = unmasked;
      }

      // Advance buffer past this frame
      client.buffer = buf.slice(offset + maskSize + payloadLen);
      buf = client.buffer;

      // Opcode handling
      if (opcode === 0x8) {
        // Close frame
        try { client.socket.end(); } catch (e) {}
        this.cleanupClient(client.id);
        return;
      } else if (opcode === 0x9) {
        // Ping frame -> Send Pong (0x8A)
        try { client.socket.write(Buffer.from([0x8a, 0x00])); } catch (e) {}
      } else if (opcode === 0xa) {
        // Pong response
        client.isAlive = true;
      } else if (opcode === 0x1) {
        // Text Frame
        client.isAlive = true;
        try {
          const text = payload.toString('utf8');
          const data = JSON.parse(text);
          this.handleClientMessage(client, data);
        } catch (e) {
          logger.warn('SOCKET', 'PARSE_ERROR', `Invalid JSON received from ${client.id}: ${e.message}`);
        }
      }
    }
  }

  /**
   * Encode and send a WebSocket frame to client
   */
  send(socket, data) {
    if (!socket || socket.destroyed || !socket.writable) return;
    try {
      const json = typeof data === 'string' ? data : JSON.stringify(data);
      const payload = Buffer.from(json, 'utf8');
      const len = payload.length;

      let header;
      if (len <= 125) {
        header = Buffer.from([0x81, len]);
      } else if (len <= 65535) {
        header = Buffer.alloc(4);
        header[0] = 0x81;
        header[1] = 126;
        header.writeUInt16BE(len, 2);
      } else {
        header = Buffer.alloc(10);
        header[0] = 0x81;
        header[1] = 127;
        header.writeBigUInt64BE(BigInt(len), 2);
      }

      socket.write(Buffer.concat([header, payload]));
    } catch (err) {
      logger.warn('SOCKET', 'SEND_ERROR', `Could not write to socket: ${err.message}`);
    }
  }

  /**
   * Handle parsed incoming message from client
   */
  async handleClientMessage(client, msg) {
    const { type, chatId, userId, text, attachmentUrl, isTyping } = msg;

    switch (type) {
      case 'auth':
      case 'authenticate': {
        if (userId) {
          this.bindUser(client.id, userId, msg.name || 'User');
          this.send(client.socket, {
            type: 'authenticated',
            userId: String(userId),
            socketId: client.id,
            onlineUsers: Array.from(this.userSockets.keys())
          });
        }
        break;
      }

      case 'join_chat':
      case 'join_room': {
        if (chatId) {
          const room = `chat_${chatId}`;
          client.rooms.add(room);
          if (!this.rooms.has(room)) this.rooms.set(room, new Set());
          this.rooms.get(room).add(client.id);

          this.send(client.socket, {
            type: 'joined_chat',
            chatId: String(chatId),
            room
          });

          // Mark messages in this chat as read for this user
          if (client.userId) {
            await this.markMessagesAsRead(chatId, client.userId);
          }
        }
        break;
      }

      case 'leave_chat':
      case 'leave_room': {
        if (chatId) {
          const room = `chat_${chatId}`;
          client.rooms.delete(room);
          if (this.rooms.has(room)) {
            this.rooms.get(room).delete(client.id);
          }
        }
        break;
      }

      case 'typing': {
        if (chatId) {
          const room = `chat_${chatId}`;
          this.broadcastToRoom(room, {
            type: 'typing',
            chatId: String(chatId),
            senderId: String(client.userId || userId),
            senderName: client.userName || msg.senderName || 'User',
            isTyping: Boolean(isTyping)
          }, client.id);
        }
        break;
      }

      case 'send_message': {
        await this.handleSendMessage(client, msg);
        break;
      }

      case 'mark_read': {
        if (chatId && (client.userId || userId)) {
          await this.markMessagesAsRead(chatId, client.userId || userId);
        }
        break;
      }

      case 'ping': {
        this.send(client.socket, { type: 'pong', timestamp: Date.now() });
        break;
      }

      default:
        break;
    }
  }

  /**
   * Save message to database and broadcast to all room participants
   */
  async handleSendMessage(client, msg) {
    const { chatId, text, attachmentUrl } = msg;
    const senderId = client.userId || msg.senderId;

    if (!chatId || !senderId || (!text && !attachmentUrl)) {
      return;
    }

    try {
      const cleanText = text ? text.trim() : 'Sent an attachment';

      // 1. Insert into MySQL chat_messages table
      const insertRes = await query(
        'INSERT INTO chat_messages (chat_id, sender_id, message_text, attachment_url) VALUES (?, ?, ?, ?)',
        [chatId, senderId, cleanText, attachmentUrl || null]
      );

      // 2. Update parent chat record
      await query(
        'UPDATE chats SET last_message = ?, last_message_time = NOW() WHERE id = ?',
        [cleanText, chatId]
      );

      // 3. Format message object matching frontend CarDetail/Chat structure
      const formattedMsg = {
        id: String(insertRes.insertId),
        chatId: String(chatId),
        senderId: String(senderId),
        senderName: client.userName || msg.senderName || 'User',
        text: cleanText,
        attachmentUrl: attachmentUrl || null,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: new Date().toISOString()
      };

      // 4. Broadcast to the chat room
      const room = `chat_${chatId}`;
      this.broadcastToRoom(room, {
        type: 'new_message',
        chatId: String(chatId),
        message: formattedMsg
      });

      // 5. Lookup buyer & seller to send updated chat lists and unread updates
      const chatRows = await query(
        'SELECT buyer_id, seller_id, listing_id FROM chats WHERE id = ?',
        [chatId]
      );
      const chatMeta = chatRows[0];
      if (chatMeta) {
        const recipientId = String(chatMeta.buyer_id) === String(senderId)
          ? String(chatMeta.seller_id)
          : String(chatMeta.buyer_id);

        // Notify recipient with conversation refresh event
        this.sendToUser(recipientId, {
          type: 'chat_updated',
          chatId: String(chatId),
          lastMessage: cleanText,
          lastMessageTime: formattedMsg.time,
          senderName: formattedMsg.senderName,
          message: formattedMsg
        });

        // 6. Intelligent Simulated Seller Auto-Reply
        // If sender is buyer chatting with another seller, trigger realistic auto-reply
        if (String(chatMeta.buyer_id) === String(senderId)) {
          this.triggerSimulatedSellerReply(chatId, recipientId, cleanText);
        }
      }
    } catch (err) {
      logger.error('SOCKET', 'SEND_MESSAGE_ERROR', err.message);
    }
  }

  /**
   * Simulated Seller Auto-Reply for instant realistic demo
   */
  triggerSimulatedSellerReply(chatId, sellerId, buyerText) {
    const room = `chat_${chatId}`;
    const lower = (buyerText || '').toLowerCase();

    const replyText =
      lower.includes('price') || lower.includes('final') || lower.includes('best')
        ? 'Hi, price is slightly negotiable on table when you inspect the vehicle in person.'
        : lower.includes('test') || lower.includes('drive')
        ? 'Yes, test drive is available today between 10 AM to 6 PM. Where are you located?'
        : lower.includes('available') || lower.includes('still')
        ? 'Yes, the car is available with complete authorized service records and clear title.'
        : lower.includes('service') || lower.includes('insurance')
        ? 'Insurance is valid and bumper-to-bumper with zero dep. All service done at official dealership.'
        : 'Thank you for your interest! Let me know what time suits you for physical verification.';

    // Emit live typing indicator after 400ms
    setTimeout(() => {
      this.broadcastToRoom(room, {
        type: 'typing',
        chatId: String(chatId),
        senderId: String(sellerId),
        senderName: 'Seller',
        isTyping: true
      });
    }, 400);

    // Send reply after 1500ms
    setTimeout(async () => {
      try {
        // Turn off typing
        this.broadcastToRoom(room, {
          type: 'typing',
          chatId: String(chatId),
          senderId: String(sellerId),
          senderName: 'Seller',
          isTyping: false
        });

        // Insert reply into DB
        const replyRes = await query(
          'INSERT INTO chat_messages (chat_id, sender_id, message_text) VALUES (?, ?, ?)',
          [chatId, sellerId, replyText]
        );

        await query(
          'UPDATE chats SET last_message = ?, last_message_time = NOW() WHERE id = ?',
          [replyText, chatId]
        );

        const sellerMsg = {
          id: String(replyRes.insertId),
          chatId: String(chatId),
          senderId: String(sellerId),
          senderName: 'Seller',
          text: replyText,
          attachmentUrl: null,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          createdAt: new Date().toISOString()
        };

        this.broadcastToRoom(room, {
          type: 'new_message',
          chatId: String(chatId),
          message: sellerMsg
        });
      } catch (e) {
        logger.warn('SOCKET', 'AUTO_REPLY_ERROR', e.message);
      }
    }, 1500);
  }

  /**
   * Mark messages as read in database and broadcast read receipt
   */
  async markMessagesAsRead(chatId, userId) {
    try {
      await query(
        'UPDATE chat_messages SET is_read = 1 WHERE chat_id = ? AND sender_id != ?',
        [chatId, userId]
      );
      this.broadcastToRoom(`chat_${chatId}`, {
        type: 'messages_read',
        chatId: String(chatId),
        readBy: String(userId)
      });
    } catch (e) {}
  }

  /**
   * Helper: Associate client socket with a user ID
   */
  bindUser(socketId, userId, userName = 'User') {
    const client = this.clients.get(socketId);
    if (!client) return;

    client.userId = String(userId);
    client.userName = userName;

    if (!this.userSockets.has(client.userId)) {
      this.userSockets.set(client.userId, new Set());
    }
    this.userSockets.get(client.userId).add(socketId);

    // Broadcast online status
    this.broadcast({
      type: 'user_status',
      userId: client.userId,
      status: 'online'
    });
  }

  /**
   * Helper: Send message to all sockets in a room
   */
  broadcastToRoom(roomName, payload, exceptSocketId = null) {
    const socketIds = this.rooms.get(roomName);
    if (!socketIds) return;

    for (const sid of socketIds) {
      if (sid === exceptSocketId) continue;
      const client = this.clients.get(sid);
      if (client && client.socket) {
        this.send(client.socket, payload);
      }
    }
  }

  /**
   * Helper: Send message to a specific user across all their connected devices
   */
  sendToUser(userId, payload) {
    const socketIds = this.userSockets.get(String(userId));
    if (!socketIds) return;

    for (const sid of socketIds) {
      const client = this.clients.get(sid);
      if (client && client.socket) {
        this.send(client.socket, payload);
      }
    }
  }

  /**
   * Helper: Broadcast message to every connected client
   */
  broadcast(payload) {
    for (const client of this.clients.values()) {
      if (client.socket) {
        this.send(client.socket, payload);
      }
    }
  }

  /**
   * Clean up client on disconnect
   */
  cleanupClient(socketId) {
    const client = this.clients.get(socketId);
    if (!client) return;

    // Leave all rooms
    for (const room of client.rooms) {
      if (this.rooms.has(room)) {
        this.rooms.get(room).delete(socketId);
        if (this.rooms.get(room).size === 0) {
          this.rooms.delete(room);
        }
      }
    }

    // Unbind user
    if (client.userId && this.userSockets.has(client.userId)) {
      this.userSockets.get(client.userId).delete(socketId);
      if (this.userSockets.get(client.userId).size === 0) {
        this.userSockets.delete(client.userId);
        this.broadcast({
          type: 'user_status',
          userId: client.userId,
          status: 'offline'
        });
      }
    }

    this.clients.delete(socketId);
    logger.info('SOCKET', 'CLIENT_DISCONNECTED', `Client disconnected: ${socketId} (Remaining: ${this.clients.size})`);
  }
}

const socketService = new SocketService();
module.exports = socketService;
