/**
 * Client-Side Real-Time WebSocket Socket Service
 * Uses native standard browser WebSocket with zero extra npm dependencies.
 * Handles auto-reconnection, room subscription, live message broadcast, and typing status.
 */
class SocketClient {
  constructor() {
    this.ws = null;
    this.userId = null;
    this.userName = null;
    this.currentChatId = null;
    this.listeners = new Map(); // eventType -> Set of callbacks
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.reconnectTimer = null;
    this.pingTimer = null;
    this.isConnected = false;
  }

  /**
   * Connect to backend WebSocket server
   */
  connect(userId, userName = 'User') {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      if (this.userId !== userId) {
        this.userId = userId;
        this.userName = userName;
        this.send({ type: 'auth', userId, name: userName });
      }
      return;
    }

    this.userId = userId ? String(userId) : null;
    this.userName = userName;

    try {
      const isSecure = window.location.protocol === 'https:';
      const wsProtocol = isSecure ? 'wss:' : 'ws:';
      // Use window.location.host (proxied by Vite) or fallback to direct backend (localhost:5000)
      const host = (this.reconnectAttempts > 0 && window.location.hostname === 'localhost')
        ? 'localhost:5000'
        : window.location.host;
      const wsUrl = `${wsProtocol}//${host}/ws/chat?userId=${encodeURIComponent(this.userId || '')}&name=${encodeURIComponent(this.userName || '')}`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emit('connection_status', { connected: true });

        // Authenticate socket connection
        if (this.userId) {
          this.send({ type: 'auth', userId: this.userId, name: this.userName });
        }

        // Rejoin active chat room if any
        if (this.currentChatId) {
          this.joinChat(this.currentChatId);
        }

        // Start ping heartbeat
        if (this.pingTimer) clearInterval(this.pingTimer);
        this.pingTimer = setInterval(() => {
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.send({ type: 'ping' });
          }
        }, 20000);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleIncomingMessage(data);
        } catch (e) {
          console.warn('[SocketClient] Non-JSON payload received:', event.data);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.emit('connection_status', { connected: false });
        if (this.pingTimer) clearInterval(this.pingTimer);
        this.scheduleReconnect();
      };

      this.ws.onerror = (err) => {
        console.warn('[SocketClient] WebSocket error event');
        // onclose will be triggered automatically
      };
    } catch (err) {
      console.error('[SocketClient] Connection initiation error:', err);
      this.scheduleReconnect();
    }
  }

  /**
   * Exponential backoff reconnection
   */
  scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn('[SocketClient] Max reconnect attempts reached');
      return;
    }

    const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), 10000);
    this.reconnectAttempts++;

    this.reconnectTimer = setTimeout(() => {
      if (this.userId) {
        this.connect(this.userId, this.userName);
      }
    }, delay);
  }

  /**
   * Handle incoming socket event and dispatch to listeners
   */
  handleIncomingMessage(data) {
    const { type } = data;
    if (!type) return;

    // Dispatch to registered event listeners
    this.emit(type, data);
    this.emit('*', data);
  }

  /**
   * Send JSON packet to server
   */
  send(payload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
      return true;
    }
    return false;
  }

  /**
   * Join a specific chat room
   */
  joinChat(chatId) {
    this.currentChatId = String(chatId);
    this.send({
      type: 'join_chat',
      chatId: String(chatId),
      userId: this.userId
    });
  }

  /**
   * Leave a specific chat room
   */
  leaveChat(chatId) {
    if (this.currentChatId === String(chatId)) {
      this.currentChatId = null;
    }
    this.send({
      type: 'leave_chat',
      chatId: String(chatId)
    });
  }

  /**
   * Broadcast message over socket
   */
  sendMessage(chatId, text, attachmentUrl = null) {
    return this.send({
      type: 'send_message',
      chatId: String(chatId),
      senderId: this.userId,
      senderName: this.userName,
      text: text,
      attachmentUrl: attachmentUrl
    });
  }

  /**
   * Broadcast live typing status
   */
  sendTyping(chatId, isTyping) {
    return this.send({
      type: 'typing',
      chatId: String(chatId),
      senderId: this.userId,
      senderName: this.userName,
      isTyping: Boolean(isTyping)
    });
  }

  /**
   * Mark messages in a chat as read
   */
  markRead(chatId) {
    return this.send({
      type: 'mark_read',
      chatId: String(chatId),
      userId: this.userId
    });
  }

  /**
   * Event emitter registration
   */
  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType).add(callback);
    return () => this.off(eventType, callback);
  }

  off(eventType, callback) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType).delete(callback);
    }
  }

  emit(eventType, data) {
    const handlers = this.listeners.get(eventType);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(data);
        } catch (e) {
          console.error(`[SocketClient] Handler error for ${eventType}:`, e);
        }
      }
    }
  }

  /**
   * Disconnect cleanly
   */
  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.pingTimer) clearInterval(this.pingTimer);
    if (this.ws) {
      try {
        this.ws.close();
      } catch (e) {}
      this.ws = null;
    }
    this.isConnected = false;
  }
}

export const socketService = new SocketClient();
export default socketService;
