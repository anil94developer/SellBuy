import { NotificationItem } from '../models/notification.model';

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'New message from Rakesh',
    message: 'Sure, here are more photos of Hyundai Creta.',
    time: '2 mins ago',
    type: 'messages',
    read: false,
    iconType: 'message',
  },
  {
    id: 'n2',
    title: 'Your listing is approved',
    message: 'Your Maruti Swift 2019 is now live on marketplace.',
    time: '10 mins ago',
    type: 'listings',
    read: false,
    iconType: 'approval',
  },
  {
    id: 'n3',
    title: 'New buyer interest',
    message: 'Amit Kumar viewed your contact details for Hyundai Creta.',
    time: '30 mins ago',
    type: 'listings',
    read: false,
    iconType: 'interest',
  },
  {
    id: 'n4',
    title: 'Price alert: Hyundai Creta',
    message: 'Price dropped by ₹ 25,000 for your saved vehicle in Jaipur.',
    time: '1 hour ago',
    type: 'all',
    read: true,
    iconType: 'price_alert',
  },
  {
    id: 'n5',
    title: 'New feature available',
    message: 'You can now book direct door-step inspection in Jaipur.',
    time: '1 day ago',
    type: 'all',
    read: true,
    iconType: 'feature',
  },
];

let inMemoryNotifications = [...INITIAL_NOTIFICATIONS];

export const notificationService = {
  getNotifications(filterType: 'all' | 'messages' | 'listings' = 'all'): NotificationItem[] {
    if (filterType === 'all') return inMemoryNotifications;
    return inMemoryNotifications.filter(n => n.type === filterType || n.type === 'all');
  },

  markAsRead(id: string) {
    const item = inMemoryNotifications.find(n => n.id === id);
    if (item) item.read = true;
  },

  markAllAsRead() {
    inMemoryNotifications.forEach(n => (n.read = true));
  },
};
