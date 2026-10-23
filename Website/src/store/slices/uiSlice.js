import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthModalOpen: false,
  isCityModalOpen: false,
  isFilterModalOpen: false,
  isSellWizardOpen: false,
  sellStep: 1,
  isMyListingsOpen: false,
  isSavedCarsOpen: false,
  isNotificationsOpen: false,
  isProfileOpen: false,
  isDrawerOpen: false,
  sellerModalData: null,
  toastMessage: null,
  viewMode: 'desktop' // 'desktop' or 'mobile'
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setAuthModalOpen: (state, action) => {
      state.isAuthModalOpen = action.payload;
    },
    setCityModalOpen: (state, action) => {
      state.isCityModalOpen = action.payload;
    },
    setFilterModalOpen: (state, action) => {
      state.isFilterModalOpen = action.payload;
    },
    setSellWizardOpen: (state, action) => {
      state.isSellWizardOpen = action.payload;
    },
    setSellStep: (state, action) => {
      state.sellStep = action.payload;
    },
    setMyListingsOpen: (state, action) => {
      state.isMyListingsOpen = action.payload;
    },
    setSavedCarsOpen: (state, action) => {
      state.isSavedCarsOpen = action.payload;
    },
    setNotificationsOpen: (state, action) => {
      state.isNotificationsOpen = action.payload;
    },
    setProfileOpen: (state, action) => {
      state.isProfileOpen = action.payload;
    },
    setDrawerOpen: (state, action) => {
      state.isDrawerOpen = action.payload;
    },
    setSellerModalData: (state, action) => {
      state.sellerModalData = action.payload;
    },
    setToastMessage: (state, action) => {
      state.toastMessage = action.payload;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    }
  }
});

export const {
  setAuthModalOpen,
  setCityModalOpen,
  setFilterModalOpen,
  setSellWizardOpen,
  setSellStep,
  setMyListingsOpen,
  setSavedCarsOpen,
  setNotificationsOpen,
  setProfileOpen,
  setDrawerOpen,
  setSellerModalData,
  setToastMessage,
  setViewMode
} = uiSlice.actions;

export default uiSlice.reducer;
