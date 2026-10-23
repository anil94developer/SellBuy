import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, GUEST_USER, DEMO_USER } from '../../models/auth.model';

export interface UserState {
  isLoggedIn: boolean;
  currentUser: User;
  selectedCity: string;
  phoneNumber: string;
  isLocationAllowed: boolean;
}

const initialState: UserState = {
  isLoggedIn: false,
  currentUser: GUEST_USER,
  selectedCity: 'Jaipur, Rajasthan',
  phoneNumber: '',
  isLocationAllowed: true,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isLoggedIn = Boolean(action.payload && action.payload.id);
      if (action.payload?.phone) {
        state.phoneNumber = action.payload.phone;
      }
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isLoggedIn = true;
      if (action.payload?.phone) {
        state.phoneNumber = action.payload.phone;
      }
    },
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.phoneNumber = action.payload;
    },
    setSelectedCity: (state, action: PayloadAction<string>) => {
      state.selectedCity = action.payload;
    },
    setLocationAllowed: (state, action: PayloadAction<boolean>) => {
      state.isLocationAllowed = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.currentUser = GUEST_USER;
      state.phoneNumber = '';
    },
  },
});

export const {
  setUser,
  loginSuccess,
  setPhoneNumber,
  setSelectedCity,
  setLocationAllowed,
  logout,
} = userSlice.actions;

export default userSlice.reducer;
