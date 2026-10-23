import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Conversation, ChatMessage } from '../../models/chat.model';
import { chatService, INITIAL_CONVERSATIONS } from '../../services/chatService';

export interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation;
}

const initialState: ChatState = {
  conversations: INITIAL_CONVERSATIONS,
  activeConversation: INITIAL_CONVERSATIONS[0],
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    selectConversation: (state, action: PayloadAction<string>) => {
      const found = state.conversations.find((c) => c.id === action.payload);
      if (found) {
        state.activeConversation = found;
        found.unreadCount = 0;
      }
    },

    sendMessage: (
      state,
      action: PayloadAction<{ text: string; images?: string[] }>
    ) => {
      const { text, images } = action.payload;
      const newMsg: ChatMessage = {
        id: Date.now().toString(),
        senderId: 'buyer',
        senderName: 'You',
        text,
        time: 'Just now',
        isMe: true,
        images,
      };

      state.activeConversation.messages.push(newMsg);
      state.activeConversation.lastMessage =
        text || (images && images.length ? '📷 [Photo Attached]' : 'Message');
      state.activeConversation.lastMessageTime = 'Just now';

      // Keep conversations list updated
      const convIndex = state.conversations.findIndex(
        (c) => c.id === state.activeConversation.id
      );
      if (convIndex !== -1) {
        state.conversations[convIndex] = { ...state.activeConversation };
      }
    },

    receiveSellerReply: (
      state,
      action: PayloadAction<{ conversationId: string; text: string; images?: string[] }>
    ) => {
      const { conversationId, text, images } = action.payload;
      const target = state.conversations.find((c) => c.id === conversationId);
      if (target) {
        const replyMsg: ChatMessage = {
          id: 'reply_' + Date.now().toString(),
          senderId: target.sellerId,
          senderName: target.sellerName,
          senderAvatar: target.sellerAvatar,
          text,
          time: 'Just now',
          isMe: false,
          images,
        };
        target.messages.push(replyMsg);
        target.lastMessage = text;
        target.lastMessageTime = 'Just now';
        if (state.activeConversation.id === conversationId) {
          state.activeConversation = { ...target };
        }
      }
    },

    startChatWithCar: (
      state,
      action: PayloadAction<{
        carId: string;
        title: string;
        price: string;
        image?: string;
        sellerName?: string;
        sellerPhone?: string;
        sellerAvatar?: string;
        sellerLocation?: string;
      }>
    ) => {
      const car = action.payload;
      const existing = state.conversations.find((c) => c.carId === car.carId);
      if (existing) {
        state.activeConversation = existing;
      } else {
        const newConv: Conversation = {
          id: 'c_' + Date.now(),
          sellerId: 's_' + Date.now(),
          sellerName: car.sellerName || 'Car Seller',
          sellerAvatar:
            car.sellerAvatar ||
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          sellerPhone: car.sellerPhone || '+91 98765-43210',
          sellerRating: 4.8,
          sellerBadge: 'Verified Seller',
          sellerLocation: car.sellerLocation || 'Jaipur',
          carId: car.carId,
          carTitle: car.title,
          carPrice: car.price,
          carImage: car.image,
          isOnline: true,
          lastMessage: `Inquiry started for ${car.title}`,
          lastMessageTime: 'Just now',
          unreadCount: 0,
          messages: [
            {
              id: 'm_init_' + Date.now(),
              senderId: 'buyer',
              senderName: 'You',
              text: `Hi ${car.sellerName || 'Seller'}, is this ${car.title} available for inspection?`,
              time: 'Just now',
              isMe: true,
            },
          ],
        };
        state.conversations = [newConv, ...state.conversations];
        state.activeConversation = newConv;
      }
    },

    setActiveConversationByCar: (
      state,
      action: PayloadAction<{
        carId: string;
        sellerName: string;
        carTitle: string;
        carPrice: string;
      }>
    ) => {
      const { carId, sellerName, carTitle, carPrice } = action.payload;
      const existing = state.conversations.find((c) => c.carId === carId);
      if (existing) {
        state.activeConversation = existing;
      } else {
        state.activeConversation.carId = carId;
        state.activeConversation.sellerName = sellerName;
        state.activeConversation.carTitle = carTitle;
        state.activeConversation.carPrice = carPrice;
      }
    },
  },
});

export const {
  selectConversation,
  sendMessage,
  receiveSellerReply,
  startChatWithCar,
  setActiveConversationByCar,
} = chatSlice.actions;

export default chatSlice.reducer;
