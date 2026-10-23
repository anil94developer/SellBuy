export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'all' | 'messages' | 'listings';
  read: boolean;
  iconType: 'message' | 'approval' | 'interest' | 'price_alert' | 'feature';
}
