import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  conversations: [],
  activeConversation: null,
  notifications: [],
  isOpen: false,
  isSocketConnected: false,
  typingStatus: {} // { [chatId]: { isTyping: boolean, senderName: string, senderId: string } }
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload || [];
    },
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
      if (action.payload && action.payload.id) {
        // Clear unread count for the active conversation
        const conv = state.conversations.find(c => String(c.id) === String(action.payload.id));
        if (conv) conv.unreadCount = 0;
      }
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload || [];
    },
    setChatOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    setSocketConnected: (state, action) => {
      state.isSocketConnected = Boolean(action.payload);
    },
    setTypingStatus: (state, action) => {
      const { chatId, isTyping, senderName, senderId } = action.payload;
      if (!chatId) return;
      state.typingStatus[String(chatId)] = {
        isTyping: Boolean(isTyping),
        senderName: senderName || 'Someone',
        senderId: String(senderId || '')
      };
    },
    appendSocketMessage: (state, action) => {
      const { chatId, message, currentUserId } = action.payload;
      if (!chatId || !message) return;

      const strChatId = String(chatId);

      // 1. If currently viewing this conversation, append message
      if (state.activeConversation && String(state.activeConversation.id) === strChatId) {
        const msgs = state.activeConversation.messages || [];
        const exists = msgs.some(m => String(m.id) === String(message.id));
        if (!exists) {
          state.activeConversation.messages = [
            ...msgs,
            {
              ...message,
              isMe: currentUserId ? String(message.senderId) === String(currentUserId) : false
            }
          ];
        }
        state.activeConversation.lastMessage = message.text;
        state.activeConversation.lastMessageTime = message.time;
      }

      // 2. Update conversation list preview & unread badge
      const convIndex = state.conversations.findIndex(c => String(c.id) === strChatId);
      if (convIndex !== -1) {
        const conv = { ...state.conversations[convIndex] };
        conv.lastMessage = message.text;
        conv.lastMessageTime = message.time;

        const isCurrentlyViewing = state.isOpen && state.activeConversation && String(state.activeConversation.id) === strChatId;
        const isFromMe = currentUserId && String(message.senderId) === String(currentUserId);

        if (!isCurrentlyViewing && !isFromMe) {
          conv.unreadCount = (conv.unreadCount || 0) + 1;
        }

        // Move active conversation to top of list
        const updatedList = [...state.conversations];
        updatedList.splice(convIndex, 1);
        state.conversations = [conv, ...updatedList];
      }
    },
    markMessagesAsReadLocally: (state, action) => {
      const chatId = String(action.payload);
      const conv = state.conversations.find(c => String(c.id) === chatId);
      if (conv) conv.unreadCount = 0;
    },
    sendMessageRequest: () => {}
  }
});

export const {
  setConversations,
  setActiveConversation,
  setNotifications,
  setChatOpen,
  setSocketConnected,
  setTypingStatus,
  appendSocketMessage,
  markMessagesAsReadLocally,
  sendMessageRequest
} = chatSlice.actions;

export default chatSlice.reducer;
