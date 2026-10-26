import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects';
import { ApiService } from '../../models/ApiService';
import {
  fetchCarsRequest,
  fetchCarsSuccess,
  fetchCarsFailure,
  setCarsPage,
  toggleFavoriteRequest,
  setSavedCarIds,
  setSavedCars,
  createCarRequest,
  updateCarRequest,
  deleteCarRequest
} from '../slices/carsSlice';

// Selector to get current filters
const selectFilters = (state) => state.cars.filters;
const selectCurrentUser = (state) => state.auth.currentUser;

function* fetchCarsWorker() {
  try {
    const filters = yield select(selectFilters);
    const pagination = yield select((state) => state.cars.pagination);
    const res = yield call(ApiService.getCars, {
      q: filters.keyword,
      brand: filters.selectedBrand,
      city: filters.selectedCity === 'All Cities' ? '' : filters.selectedCity,
      maxPrice: filters.maxBudget,
      minPrice: filters.minPrice,
      fuel: filters.selectedFuel,
      transmission: filters.selectedTransmission,
      yearFrom: filters.yearFrom,
      yearTo: filters.yearTo,
      tab: filters.activeTab,
      page: pagination?.page || 1,
      limit: pagination?.limit || 12
    });

    if (res && res.cars) {
      let sorted = [...res.cars];
      if (filters.sortBy === 'price_asc') sorted.sort((a, b) => Number(a.price) - Number(b.price));
      if (filters.sortBy === 'price_desc') sorted.sort((a, b) => Number(b.price) - Number(a.price));
      if (filters.sortBy === 'year_desc') sorted.sort((a, b) => Number(b.manufacturing_year || b.year) - Number(a.manufacturing_year || a.year));
      if (filters.sortBy === 'km_asc') sorted.sort((a, b) => Number(a.km_driven || a.mileage) - Number(b.km_driven || b.mileage));
      yield put(fetchCarsSuccess({ cars: sorted, pagination: res.pagination }));
    } else {
      yield put(fetchCarsSuccess({ cars: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 1 } }));
    }
  } catch (err) {
    yield put(fetchCarsFailure(err.message || 'Failed to load cars'));
  }
}

function* toggleFavoriteWorker(action) {
  try {
    const currentUser = yield select(selectCurrentUser);
    const payload = typeof action.payload === 'object' ? action.payload : { carId: action.payload, userId: currentUser?.id };
    const res = yield call(ApiService.toggleFavorite, payload.carId, payload.userId);
    if (res && res.savedCarIds) {
      yield put(setSavedCarIds(res.savedCarIds));
    } else {
      const updated = ApiService.getSavedCarIds();
      yield put(setSavedCarIds(updated));
    }
    if (payload.userId) {
      const savedRes = yield call(ApiService.getSavedCars, payload.userId);
      if (savedRes && savedRes.savedCars) {
        yield put(setSavedCars(savedRes.savedCars));
      }
    }
  } catch (err) {
    console.error('toggleFavorite error:', err);
  }
}

function* createCarWorker(action) {
  try {
    yield call(ApiService.createListing, action.payload);
    yield put(fetchCarsRequest());
  } catch (err) {
    console.error('createCar error:', err);
  }
}

function* updateCarWorker(action) {
  try {
    const { id, updates } = action.payload;
    yield call(ApiService.updateListing, id, updates);
    yield put(fetchCarsRequest());
  } catch (err) {
    console.error('updateCar error:', err);
  }
}

function* deleteCarWorker(action) {
  try {
    yield call(ApiService.deleteListing, action.payload);
    yield put(fetchCarsRequest());
  } catch (err) {
    console.error('deleteCar error:', err);
  }
}

export function* carsSaga() {
  yield takeLatest(fetchCarsRequest.type, fetchCarsWorker);
  yield takeLatest(setCarsPage.type, fetchCarsWorker);
  yield takeEvery(toggleFavoriteRequest.type, toggleFavoriteWorker);
  yield takeLatest(createCarRequest.type, createCarWorker);
  yield takeLatest(updateCarRequest.type, updateCarWorker);
  yield takeLatest(deleteCarRequest.type, deleteCarWorker);
}
