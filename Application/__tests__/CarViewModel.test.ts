import { store } from '../src/store';
import {
  fetchCars,
  createCarListing,
  toggleFavoriteCar,
  setSearchQuery,
} from '../src/store/slices/carSlice';
import { setActiveTab } from '../src/store/slices/uiSlice';

describe('Redux MVVM Car Marketplace Store & Logic', () => {
  it('should initialize with default states', () => {
    const state = store.getState();
    expect(state.cars.cars).toEqual([]);
    expect(state.cars.loading).toBe(false);
    expect(state.ui.activeTab).toBe('buyer');
  });

  it('should fetch cars via async thunk (Model Layer to Redux)', async () => {
    await store.dispatch(fetchCars());
    const state = store.getState();
    expect(state.cars.cars.length).toBeGreaterThan(0);
    expect(state.cars.loading).toBe(false);
  });

  it('should update search query in state', () => {
    store.dispatch(setSearchQuery('Creta'));
    const state = store.getState();
    expect(state.cars.searchQuery).toBe('Creta');
  });

  it('should toggle favorite status of a car', async () => {
    const firstCar = store.getState().cars.cars[0];
    const initialFavorite = !!firstCar.isFavorite;

    await store.dispatch(toggleFavoriteCar(firstCar.id));
    const updatedCar = store.getState().cars.cars.find((c) => c.id === firstCar.id);
    expect(updatedCar?.isFavorite).toBe(!initialFavorite);
  });

  it('should create new car listing (Seller ViewModel action)', async () => {
    const initialCount = store.getState().cars.cars.length;

    await store.dispatch(
      createCarListing({
        title: 'Honda Civic Type R',
        brand: 'Honda',
        model: 'Civic',
        year: 2024,
        price: 4500000,
        mileage: 5000,
        fuelType: 'Petrol',
        transmission: 'Manual',
        location: 'Delhi',
      })
    );

    const state = store.getState();
    expect(state.cars.cars.length).toBe(initialCount + 1);
    expect(state.cars.cars[0].title).toBe('Honda Civic Type R');
  });

  it('should switch active tab via uiSlice', () => {
    store.dispatch(setActiveTab('seller'));
    expect(store.getState().ui.activeTab).toBe('seller');
    store.dispatch(setActiveTab('buyer'));
    expect(store.getState().ui.activeTab).toBe('buyer');
  });
});
