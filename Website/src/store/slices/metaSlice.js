import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  brands: [],
  cities: [],
  loading: false,
  error: null
};

export const metaSlice = createSlice({
  name: 'meta',
  initialState,
  reducers: {
    fetchMetaRequest: (state) => {
      state.loading = true;
    },
    fetchMetaSuccess: (state, action) => {
      state.loading = false;
      state.brands = action.payload.brands || [];
      state.cities = action.payload.cities || [];
      state.error = null;
    },
    fetchMetaFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchMetaRequest,
  fetchMetaSuccess,
  fetchMetaFailure
} = metaSlice.actions;

export default metaSlice.reducer;
