import { Conversation, ChatMessage } from '../models/chat.model';

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    sellerId: 's1',
    sellerName: 'Rakesh Sharma',
    sellerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+91 98765-43210',
    sellerRating: 4.8,
    sellerBadge: 'Verified Dealer',
    sellerLocation: 'Malviya Nagar, Jaipur',
    carId: '1',
    carTitle: 'Hyundai Creta SX (O) 2021',
    carPrice: '₹ 11,50,000',
    carImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    isOnline: true,
    lastMessage: 'Sure, here are the original service photos and RC certificate.',
    lastMessageTime: '10:23 AM',
    unreadCount: 0,
    messages: [
      {
        id: 'm1_1',
        senderId: 'buyer',
        senderName: 'You',
        text: 'Hi Rakesh ji, is this Hyundai Creta available for inspection?',
        time: '10:20 AM',
        isMe: true,
      },
      {
        id: 'm1_2',
        senderId: 's1',
        senderName: 'Rakesh Sharma',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        text: 'Yes sir, it is available. 1st owner and fully insured till Dec 2026.',
        time: '10:21 AM',
        isMe: false,
      },
      {
        id: 'm1_3',
        senderId: 'buyer',
        senderName: 'You',
        text: 'Can you please share engine bay & interior dashboard photos?',
        time: '10:22 AM',
        isMe: true,
      },
      {
        id: 'm1_4',
        senderId: 's1',
        senderName: 'Rakesh Sharma',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        text: 'Sure, here are the original service photos and RC certificate.',
        time: '10:23 AM',
        isMe: false,
        images: [
          'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
        ],
      },
    ],
  },
  {
    id: 'c2',
    sellerId: 's2',
    sellerName: 'Priya Verma',
    sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+91 98111-22334',
    sellerRating: 4.9,
    sellerBadge: 'Individual Owner',
    sellerLocation: 'Vaishali Nagar, Jaipur',
    carId: '2',
    carTitle: 'Maruti Suzuki Swift ZXi+ 2022',
    carPrice: '₹ 6,80,000',
    carImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    isOnline: true,
    lastMessage: 'All service records from Maruti Authorized center are available.',
    lastMessageTime: 'Yesterday',
    unreadCount: 1,
    messages: [
      {
        id: 'm2_1',
        senderId: 'buyer',
        senderName: 'You',
        text: 'Hello Priya, are you the first owner of this Swift?',
        time: 'Yesterday 4:10 PM',
        isMe: true,
      },
      {
        id: 'm2_2',
        senderId: 's2',
        senderName: 'Priya Verma',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        text: 'Yes, single hand driven by me in Jaipur city only. Mileage is genuine 22,000 KM.',
        time: 'Yesterday 4:15 PM',
        isMe: false,
      },
      {
        id: 'm2_3',
        senderId: 's2',
        senderName: 'Priya Verma',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        text: 'All service records from Maruti Authorized center are available.',
        time: 'Yesterday 4:16 PM',
        isMe: false,
      },
    ],
  },
  {
    id: 'c3',
    sellerId: 's3',
    sellerName: 'Vikram Singh',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+91 97888-55443',
    sellerRating: 4.7,
    sellerBadge: 'Certified Dealer',
    sellerLocation: 'Mansarovar, Jaipur',
    carId: '3',
    carTitle: 'Mahindra Thar LX Hard Top 2023',
    carPrice: '₹ 14,20,000',
    carImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    isOnline: false,
    lastMessage: 'You can come tomorrow morning at 11 AM for test drive.',
    lastMessageTime: 'Oct 8',
    unreadCount: 0,
    messages: [
      {
        id: 'm3_1',
        senderId: 'buyer',
        senderName: 'You',
        text: 'Hi Vikram, can I schedule a test drive for Thar?',
        time: 'Oct 8, 2:30 PM',
        isMe: true,
      },
      {
        id: 'm3_2',
        senderId: 's3',
        senderName: 'Vikram Singh',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        text: 'You can come tomorrow morning at 11 AM for test drive.',
        time: 'Oct 8, 2:35 PM',
        isMe: false,
      },
    ],
  },
  {
    id: 'c4',
    sellerId: 's4',
    sellerName: 'Ananya Joshi',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+91 99222-33445',
    sellerRating: 4.9,
    sellerBadge: 'EV Specialist',
    sellerLocation: 'C-Scheme, Jaipur',
    carId: '4',
    carTitle: 'Tata Nexon EV Max 2022',
    carPrice: '₹ 13,50,000',
    carImage: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80',
    isOnline: true,
    lastMessage: 'Battery health is at 98% with 6 years warranty remaining.',
    lastMessageTime: 'Oct 7',
    unreadCount: 0,
    messages: [
      {
        id: 'm4_1',
        senderId: 'buyer',
        senderName: 'You',
        text: 'Hi Ananya, what is the current real-world range on full charge?',
        time: 'Oct 7, 11:00 AM',
        isMe: true,
      },
      {
        id: 'm4_2',
        senderId: 's4',
        senderName: 'Ananya Joshi',
        senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        text: 'Easily gives 320-340 km with AC in city driving.',
        time: 'Oct 7, 11:05 AM',
        isMe: false,
      },
      {
        id: 'm4_3',
        senderId: 's4',
        senderName: 'Ananya Joshi',
        senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        text: 'Battery health is at 98% with 6 years warranty remaining.',
        time: 'Oct 7, 11:06 AM',
        isMe: false,
      },
    ],
  },
  {
    id: 'c5',
    sellerId: 's5',
    sellerName: 'Mohit Choudhary',
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+91 97111-88990',
    sellerRating: 4.8,
    sellerBadge: 'Auto Hub Jaipur',
    sellerLocation: 'Raja Park, Jaipur',
    carId: '5',
    carTitle: 'Kia Seltos GT Line 2021',
    carPrice: '₹ 12,90,000',
    carImage: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
    isOnline: true,
    lastMessage: 'Price can be slightly negotiated for serious direct buyer.',
    lastMessageTime: 'Oct 5',
    unreadCount: 0,
    messages: [
      {
        id: 'm5_1',
        senderId: 'buyer',
        senderName: 'You',
        text: 'Is the Kia Seltos GT line petrol DCT or diesel?',
        time: 'Oct 5, 5:00 PM',
        isMe: true,
      },
      {
        id: 'm5_2',
        senderId: 's5',
        senderName: 'Mohit Choudhary',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        text: 'It is 1.4 Turbo Petrol DCT Automatic with sunroof and Bose sound system.',
        time: 'Oct 5, 5:08 PM',
        isMe: false,
      },
      {
        id: 'm5_3',
        senderId: 's5',
        senderName: 'Mohit Choudhary',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        text: 'Price can be slightly negotiated for serious direct buyer.',
        time: 'Oct 5, 5:10 PM',
        isMe: false,
      },
    ],
  },
];

export const INITIAL_CONVERSATION: Conversation = INITIAL_CONVERSATIONS[0];

let conversationsList = [...INITIAL_CONVERSATIONS];

export const chatService = {
  getConversations(): Conversation[] {
    return conversationsList;
  },

  getConversationById(id: string): Conversation {
    return conversationsList.find(c => c.id === id) || conversationsList[0];
  },

  sendMessage(conversationId: string, text: string, images?: string[]): ChatMessage {
    const conv = conversationsList.find(c => c.id === conversationId) || conversationsList[0];
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'buyer',
      senderName: 'You',
      text,
      time: 'Just now',
      isMe: true,
      images,
    };
    conv.messages.push(newMsg);
    conv.lastMessage = text || (images && images.length ? '📷 [Photo]' : 'Message');
    conv.lastMessageTime = 'Just now';
    return newMsg;
  },

  startChatWithCar(car: {
    id: string;
    title: string;
    price: string;
    image?: string;
    sellerName?: string;
    sellerPhone?: string;
    sellerAvatar?: string;
    sellerLocation?: string;
  }): Conversation {
    const existing = conversationsList.find(c => c.carId === car.id);
    if (existing) {
      return existing;
    }

    const newConv: Conversation = {
      id: 'c_' + Date.now(),
      sellerId: 's_' + Date.now(),
      sellerName: car.sellerName || 'Car Seller',
      sellerAvatar: car.sellerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      sellerPhone: car.sellerPhone || '+91 98765-43210',
      sellerRating: 4.8,
      sellerBadge: 'Verified Seller',
      sellerLocation: car.sellerLocation || 'Jaipur',
      carId: car.id,
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
          text: `Hi ${car.sellerName || 'Seller'}, is this ${car.title} available for physical inspection?`,
          time: 'Just now',
          isMe: true,
        },
      ],
    };

    conversationsList = [newConv, ...conversationsList];
    return newConv;
  },
};
