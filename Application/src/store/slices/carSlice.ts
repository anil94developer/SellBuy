import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Car, CreateCarInput, CarFilter } from '../../models/car.model';
import { carService, INITIAL_CARS } from '../../services/carService';

export interface CarState {
  cars: Car[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedBrand: string | null;
  selectedFuel: string | null;
  selectedTab: 'all' | 'used' | 'new' | 'certified';
  myListingsTab: 'active' | 'pending' | 'sold';
  activeCar: Car | null;
  filters: CarFilter;
  sellDraft: {
    photos: string[];
    brand: string;
    model: string;
    year: number;
    regYear: number;
    kmDriven: number;
    fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
    transmission: 'Manual' | 'Automatic';
    price: number;
    city: string;
    description: string;
  };
}

const initialSellDraft = {
  photos: [
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
  ],
  brand: 'Hyundai',
  model: 'Creta',
  year: 2021,
  regYear: 2021,
  kmDriven: 30000,
  fuelType: 'Petrol' as 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid',
  transmission: 'Manual' as 'Manual' | 'Automatic',
  price: 1150000,
  city: 'Jaipur, Rajasthan',
  description: 'Well maintained Hyundai Creta 2021 model. Single owner. All documents clear.',
};

const initialState: CarState = {
  cars: [],
  loading: false,
  error: null,
  searchQuery: '',
  selectedBrand: null,
  selectedFuel: null,
  selectedTab: 'all',
  myListingsTab: 'active',
  activeCar: INITIAL_CARS[0],
  filters: {
    minPrice: 50000,
    maxPrice: 5000000,
    yearFrom: 2015,
    yearTo: 2024,
  },
  sellDraft: initialSellDraft,
};

// Async Thunks
export const fetchCars = createAsyncThunk<Car[], CarFilter | void, { rejectValue: string }>(
  'cars/fetchCars',
  async (filter, { rejectWithValue }) => {
    try {
      const data = await carService.fetchCars(filter || undefined);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch cars';
      return rejectWithValue(message);
    }
  }
);

export const createCarListing = createAsyncThunk<Car, CreateCarInput, { rejectValue: string }>(
  'cars/createListing',
  async (input, { rejectWithValue }) => {
    try {
      const newCar = await carService.createListing(input);
      return newCar;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create listing';
      return rejectWithValue(message);
    }
  }
);

export const toggleFavoriteCar = createAsyncThunk<string, string, { rejectValue: string }>(
  'cars/toggleFavorite',
  async (carId, { rejectWithValue }) => {
    try {
      await carService.toggleFavorite(carId);
      return carId;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to toggle favorite';
      return rejectWithValue(message);
    }
  }
);

export const updateCarListing = createAsyncThunk<Car, { id: string; updates: Partial<Car> }, { rejectValue: string }>(
  'cars/updateListing',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const updated = await carService.updateListing(id, updates);
      return updated;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update listing';
      return rejectWithValue(message);
    }
  }
);

export const deleteCarListing = createAsyncThunk<string, string, { rejectValue: string }>(
  'cars/deleteListing',
  async (id, { rejectWithValue }) => {
    try {
      await carService.deleteListing(id);
      return id;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete listing';
      return rejectWithValue(message);
    }
  }
);

export const carSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedBrand: (state, action: PayloadAction<string | null>) => {
      state.selectedBrand = action.payload;
    },
    setSelectedFuel: (state, action: PayloadAction<string | null>) => {
      state.selectedFuel = action.payload;
    },
    setSelectedTab: (state, action: PayloadAction<'all' | 'used' | 'new' | 'certified'>) => {
      state.selectedTab = action.payload;
    },
    setMyListingsTab: (state, action: PayloadAction<'active' | 'pending' | 'sold'>) => {
      state.myListingsTab = action.payload;
    },
    setActiveCar: (state, action: PayloadAction<Car | null>) => {
      state.activeCar = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<CarFilter>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.searchQuery = '';
      state.selectedBrand = null;
      state.selectedFuel = null;
      state.selectedTab = 'all';
      state.filters = {
        minPrice: 50000,
        maxPrice: 5000000,
        yearFrom: 2015,
        yearTo: 2024,
      };
    },
    updateSellDraft: (state, action: PayloadAction<Partial<typeof initialSellDraft>>) => {
      state.sellDraft = { ...state.sellDraft, ...action.payload };
    },
    resetSellDraft: (state) => {
      state.sellDraft = initialSellDraft;
    },
  },
  extraReducers: (builder) => {
    // Fetch Cars
    builder
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = action.payload;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load cars';
      });

    // Create Listing
    builder
      .addCase(createCarListing.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCarListing.fulfilled, (state, action) => {
        state.loading = false;
        state.cars.unshift(action.payload);
        if (state.activeCar === null) {
          state.activeCar = action.payload;
        }
      })
      .addCase(createCarListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to create listing';
      });

    // Toggle Favorite
    builder.addCase(toggleFavoriteCar.fulfilled, (state, action) => {
      const carId = action.payload;
      const existingCar = state.cars.find((c) => c.id === carId);
      if (existingCar) {
        existingCar.isFavorite = !existingCar.isFavorite;
        if (state.activeCar?.id === carId) {
          state.activeCar.isFavorite = existingCar.isFavorite;
        }
      }
    });

    // Update Listing
    builder.addCase(updateCarListing.fulfilled, (state, action) => {
      const updated = action.payload;
      const idx = state.cars.findIndex((c) => c.id === updated.id);
      if (idx !== -1) {
        state.cars[idx] = updated;
      }
      if (state.activeCar?.id === updated.id) {
        state.activeCar = updated;
      }
    });

    // Delete Listing
    builder.addCase(deleteCarListing.fulfilled, (state, action) => {
      const id = action.payload;
      state.cars = state.cars.filter((c) => c.id !== id);
    });
  },
});

export const {
  setSearchQuery,
  setSelectedBrand,
  setSelectedFuel,
  setSelectedTab,
  setMyListingsTab,
  setActiveCar,
  setFilters,
  clearFilters,
  updateSellDraft,
  resetSellDraft,
} = carSlice.actions;

export default carSlice.reducer;
