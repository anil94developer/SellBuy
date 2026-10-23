export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  time: string;
  isMe: boolean;
  images?: string[];
}

export interface Conversation {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  sellerPhone?: string;
  sellerRating?: number;
  sellerBadge?: string;
  sellerLocation?: string;
  carId: string;
  carTitle: string;
  carPrice: string;
  carImage?: string;
  isOnline: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number;
  messages: ChatMessage[];
}
