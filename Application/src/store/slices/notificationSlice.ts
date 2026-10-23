import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationItem } from '../../models/notification.model';
import { INITIAL_NOTIFICATIONS } from '../../services/notificationService';

export interface NotificationState {
  items: NotificationItem[];
  activeFilter: 'all' | 'messages' | 'listings';
}

const initialState: NotificationState = {
  items: INITIAL_NOTIFICATIONS,
  activeFilter: 'all',
};

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setActiveFilter: (state, action: PayloadAction<'all' | 'messages' | 'listings'>) => {
      state.activeFilter = action.payload;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item) item.read = true;
    },
    markAllAsRead: (state) => {
      state.items.forEach(i => (i.read = true));
    },
  },
});

export const { setActiveFilter, markAsRead, markAllAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;
