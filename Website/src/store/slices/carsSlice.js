import { createSlice } from '@reduxjs/toolkit';
import { ApiService } from '../../models/ApiService';

const initialSaved = ApiService.getSavedCarIds();

const initialState = {
  items: [],
  loading: true,
  error: null,
  filters: {
    keyword: '',
    selectedBrand: '',
    selectedCity: 'Jaipur, Rajasthan',
    maxBudget: '',
    minPrice: '',
    selectedFuel: '',
    selectedTransmission: '',
    yearFrom: '',
    yearTo: '',
    activeTab: 'all',
    sortBy: 'featured'
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  },
  savedCarIds: initialSaved,
  savedCars: [],
  userListings: [],
  userListingsCounts: { active: 0, pending: 0, sold: 0 },
  selectedCar: null,
  galleryCar: null,
  editListingCar: null,
  myListingsTab: 'all'
};

export const carsSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    // SAGA triggers
    fetchCarsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCarsSuccess: (state, action) => {
      state.loading = false;
      if (Array.isArray(action.payload)) {
        state.items = action.payload;
        state.pagination.total = action.payload.length;
      } else if (action.payload && action.payload.cars) {
        state.items = action.payload.cars;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      }
      state.error = null;
    },
    setCarsPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    fetchCarsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Filter mutations
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    resetFilters: (state) => {
      state.filters = {
        keyword: '',
        selectedBrand: '',
        selectedCity: state.filters.selectedCity || 'Jaipur, Rajasthan',
        maxBudget: '',
        minPrice: '',
        selectedFuel: '',
        selectedTransmission: '',
        yearFrom: '',
        yearTo: '',
        activeTab: 'all',
        sortBy: 'featured'
      };
    },

    // Favorites
    toggleFavoriteRequest: () => {},
    setSavedCarIds: (state, action) => {
      state.savedCarIds = action.payload;
    },

    // User Listings & Saved Cars from DB
    setUserListings: (state, action) => {
      state.userListings = action.payload;
    },
    setUserListingsCounts: (state, action) => {
      state.userListingsCounts = action.payload;
    },
    setSavedCars: (state, action) => {
      state.savedCars = action.payload;
    },

    // Car mutations
    createCarRequest: () => {},
    updateCarRequest: () => {},
    deleteCarRequest: () => {},

    // UI selections
    setSelectedCar: (state, action) => {
      state.selectedCar = action.payload;
    },
    setGalleryCar: (state, action) => {
      state.galleryCar = action.payload;
    },
    setEditListingCar: (state, action) => {
      state.editListingCar = action.payload;
    },
    setMyListingsTab: (state, action) => {
      state.myListingsTab = action.payload;
    }
  }
});

export const {
  fetchCarsRequest,
  fetchCarsSuccess,
  fetchCarsFailure,
  setFilter,
  resetFilters,
  toggleFavoriteRequest,
  setSavedCarIds,
  createCarRequest,
  updateCarRequest,
  deleteCarRequest,
  setSelectedCar,
  setGalleryCar,
  setEditListingCar,
  setMyListingsTab,
  setCarsPage,
  setUserListings,
  setUserListingsCounts,
  setSavedCars
} = carsSlice.actions;

export default carsSlice.reducer;
