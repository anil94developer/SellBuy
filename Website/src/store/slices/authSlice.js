import { createSlice } from '@reduxjs/toolkit';
import { ApiService } from '../../models/ApiService';

const initialUser = ApiService.getCurrentUser();

const initialState = {
  currentUser: initialUser,
  authStep: 'login', // 'login' | 'otp' | 'profile'
  authPhone: '',
  loading: false,
  error: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthStep: (state, action) => {
      state.authStep = action.payload;
    },
    setAuthPhone: (state, action) => {
      state.authPhone = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    sendOtpRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    sendOtpSuccess: (state, action) => {
      state.loading = false;
      state.authStep = 'otp';
    },
    sendOtpFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    verifyOtpRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    verifyOtpSuccess: (state, action) => {
      state.loading = false;
      if (action.payload.user) {
        state.currentUser = action.payload.user;
      }
      if (action.payload.isNewUser) {
        state.authStep = 'profile';
      }
    },
    verifyOtpFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
      state.authStep = 'login';
      state.authPhone = '';
    }
  }
});

export const {
  setAuthStep,
  setAuthPhone,
  setCurrentUser,
  sendOtpRequest,
  sendOtpSuccess,
  sendOtpFailure,
  verifyOtpRequest,
  verifyOtpSuccess,
  verifyOtpFailure,
  logout
} = authSlice.actions;

export default authSlice.reducer;
