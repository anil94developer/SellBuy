import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ScreenName } from '../../navigation/navigationTypes';

export interface UIState {
  currentScreen: ScreenName;
  history: ScreenName[];
  params: Record<string, any>;
  isDrawerOpen: boolean;
  activeTab: 'buyer' | 'seller';
  feedbackMessage: string | null;
}

const initialState: UIState = {
  currentScreen: 'SPLASH',
  history: ['SPLASH'],
  params: {},
  isDrawerOpen: false,
  activeTab: 'buyer',
  feedbackMessage: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    navigateTo: (
      state,
      action: PayloadAction<{ screen: ScreenName; params?: Record<string, any> }>
    ) => {
      const { screen, params = {} } = action.payload;
      state.history.push(screen);
      state.currentScreen = screen;
      state.params = params;
      state.isDrawerOpen = false;
    },
    goBack: (state) => {
      if (state.history.length > 1) {
        state.history.pop();
        const prev = state.history[state.history.length - 1];
        state.currentScreen = prev;
      } else {
        state.currentScreen = 'HOME';
        state.history = ['HOME'];
      }
      state.isDrawerOpen = false;
    },
    setScreenDirectly: (
      state,
      action: PayloadAction<{ screen: ScreenName; params?: Record<string, any> }>
    ) => {
      state.currentScreen = action.payload.screen;
      state.params = action.payload.params || {};
      state.isDrawerOpen = false;
    },
    resetToScreen: (
      state,
      action: PayloadAction<{ screen: ScreenName; params?: Record<string, any> }>
    ) => {
      state.currentScreen = action.payload.screen;
      state.history = [action.payload.screen];
      state.params = action.payload.params || {};
      state.isDrawerOpen = false;
    },
    toggleDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    openDrawer: (state) => {
      state.isDrawerOpen = true;
    },
    closeDrawer: (state) => {
      state.isDrawerOpen = false;
    },
    setActiveTab: (state, action: PayloadAction<'buyer' | 'seller'>) => {
      state.activeTab = action.payload;
    },
    setFeedbackMessage: (state, action: PayloadAction<string | null>) => {
      state.feedbackMessage = action.payload;
    },
    clearFeedbackMessage: (state) => {
      state.feedbackMessage = null;
    },
  },
});

export const {
  navigateTo,
  goBack,
  setScreenDirectly,
  resetToScreen,
  toggleDrawer,
  openDrawer,
  closeDrawer,
  setActiveTab,
  setFeedbackMessage,
  clearFeedbackMessage,
} = uiSlice.actions;

export default uiSlice.reducer;
