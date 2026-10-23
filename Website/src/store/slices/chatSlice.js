import { createSlice } from '@reduxjs/toolkit';
import { ApiService } from '../../models/ApiService';

const initialConversations = ApiService.getConversations();
const initialNotifications = ApiService.getNotifications();

const initialState = {
  conversations: initialConversations,
  activeConversation: initialConversations[0] || null,
  notifications: initialNotifications,
  isOpen: false
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setChatOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    sendMessageRequest: () => {}
  }
});

export const {
  setConversations,
  setActiveConversation,
  setNotifications,
  setChatOpen,
  sendMessageRequest
} = chatSlice.actions;

export default chatSlice.reducer;
