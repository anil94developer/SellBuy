import { call, put, takeLatest, takeEvery, all } from 'redux-saga/effects';
import { AdminApiService } from '../../models/AdminApiService';
import {
  fetchStatsRequest,
  fetchStatsSuccess,
  fetchStatsFailure,
  fetchListingsRequest,
  fetchListingsSuccess,
  fetchListingsFailure,
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  fetchCatalogRequest,
  fetchCatalogSuccess,
  fetchCatalogFailure,
  fetchLogsRequest,
  fetchLogsSuccess,
  approveListingRequest,
  rejectListingRequest,
  toggleFeaturedRequest,
  deleteListingRequest,
  addNewCarRequest,
  toggleUserBlockRequest,
  addBrandRequest,
  updateBrandRequest,
  toggleBrandStatusRequest,
  deleteBrandRequest,
  addCategoryRequest,
  updateCategoryRequest,
  toggleCategoryStatusRequest,
  deleteCategoryRequest,
  addCityRequest,
  updateCityRequest,
  toggleCityStatusRequest,
  deleteCityRequest
} from '../slices/adminSlice';

function* fetchStatsWorker() {
  try {
    const res = yield call(AdminApiService.getStats);
    if (res && res.success) {
      yield put(fetchStatsSuccess(res.stats));
    }
  } catch (err) {
    yield put(fetchStatsFailure(err.message || 'Failed to fetch stats'));
  }
}

function* fetchListingsWorker() {
  try {
    const res = yield call(AdminApiService.getListings);
    if (res && res.success) {
      yield put(fetchListingsSuccess(res.listings));
    }
  } catch (err) {
    yield put(fetchListingsFailure(err.message || 'Failed to fetch listings'));
  }
}

function* fetchUsersWorker(action) {
  try {
    const params = action.payload || {};
    const res = yield call(AdminApiService.getUsers, params);
    if (res && res.success) {
      yield put(fetchUsersSuccess({ users: res.users, pagination: res.pagination }));
    }
  } catch (err) {
    yield put(fetchUsersFailure(err.message || 'Failed to fetch users'));
  }
}

function* fetchCatalogWorker() {
  try {
    const [bRes, cRes, catRes] = yield all([
      call(AdminApiService.getBrands),
      call(AdminApiService.getCities),
      call(AdminApiService.getCategories)
    ]);
    const brands = bRes && bRes.brands ? bRes.brands : [];
    const cities = cRes && cRes.cities ? cRes.cities : [];
    const categories = catRes && catRes.categories ? catRes.categories : [];
    yield put(fetchCatalogSuccess({ brands, cities, categories }));
  } catch (err) {
    yield put(fetchCatalogFailure(err.message || 'Failed to fetch catalog'));
  }
}

function* fetchLogsWorker() {
  try {
    const res = yield call(AdminApiService.getLogs);
    if (res && res.success) {
      yield put(fetchLogsSuccess(res.logs));
    }
  } catch (err) {
    console.warn('fetchLogsWorker error:', err);
  }
}

function* approveListingWorker(action) {
  try {
    yield call(AdminApiService.approveListing, action.payload);
    yield put(fetchListingsRequest());
    yield put(fetchStatsRequest());
  } catch (err) {
    console.error('approveListing error:', err);
  }
}

function* rejectListingWorker(action) {
  try {
    yield call(AdminApiService.rejectListing, action.payload);
    yield put(fetchListingsRequest());
    yield put(fetchStatsRequest());
  } catch (err) {
    console.error('rejectListing error:', err);
  }
}

function* toggleFeaturedWorker(action) {
  try {
    yield call(AdminApiService.toggleFeatured, action.payload);
    yield put(fetchListingsRequest());
  } catch (err) {
    console.error('toggleFeatured error:', err);
  }
}

function* deleteListingWorker(action) {
  try {
    yield call(AdminApiService.deleteListing, action.payload);
    yield put(fetchListingsRequest());
    yield put(fetchStatsRequest());
  } catch (err) {
    console.error('deleteListing error:', err);
  }
}

function* toggleUserBlockWorker(action) {
  try {
    yield call(AdminApiService.toggleUserBlock, action.payload);
    yield put(fetchUsersRequest());
  } catch (err) {
    console.error('toggleUserBlock error:', err);
  }
}

// -------------------------------------------------------------
// Catalog Workers (Brands, Categories, Cities)
// -------------------------------------------------------------
function* addBrandWorker(action) {
  try {
    yield call(AdminApiService.addBrand, action.payload);
    yield put(fetchCatalogRequest());
  } catch (err) {
    console.error('addBrand error:', err);
  }
}

function* updateBrandWorker(action) {
  try {
    const { id, data } = action.payload;
    yield call(AdminApiService.updateBrand, id, data);
    yield put(fetchCatalogRequest());
  } catch (err) {
    console.error('updateBrand error:', err);
  }
}

function* deleteBrandWorker(action) {
  try {
    yield call(AdminApiService.deleteBrand, action.payload);
    yield put(fetchCatalogRequest());
  } catch (err) {
    console.error('deleteBrand error:', err);
  }
}

function* toggleBrandStatusWorker(action) {
  try {
    yield call(AdminApiService.toggleBrandStatus, action.payload);
    yield put(fetchCatalogRequest());
  } catch (err) {
    console.error('toggleBrandStatus error:', err);
  }
}

function* addCategoryWorker(action) {
  try {
    yield call(AdminApiService.addCategory, action.payload);
    yield put(fetchCatalogRequest());
  } catch (err) {
    console.error('addCategory error:', err);
  }
}

function* updateCategoryWorker(action) {
  try {
    const { id, data } = action.payload;
    yield call(AdminApiService.updateCategory, id, data);
    yield put(fetchCatalogRequest());
  } catch (err) {
    console.error('updateCategory error:', err);
  }
}

function* toggleCategoryStatusWorker(action) {
  try {
    yield call(AdminApiService.toggleCategoryStatus, action.payload);
    yield put(fetchCatalogRequest());
  } catch (err) {
    console.error('toggleCategoryStatus error:', err);
  }
}

function* deleteCategoryWorker(action) {
  try {
    yield call(AdminApiService.deleteCategory, action.payload);
    yield put(fetchCatalogRequest());
  } catch (err) {
    console.error('deleteCategory error:', err);
  }
}

function* addCityWorker(action) {
  try {
    yield call(AdminApiService.addCity, action.payload);
    yield put(fetchCatalogRequest());
  } catch (err) {
    console.error('addCity error:', err);
  }
}

function* updateCityWorker(action) {
  try {
    const { id, data } = action.payload;
    yield call(AdminApiService.updateCity, id, data);
    yield put(fetchCatalogRequest());
  } catch (err) {
    console.error('updateCity error:', err);
  }
}

function* toggleCityStatusWorker(action) {
  try {
    yield call(AdminApiService.toggleCityStatus, action.payload);
    yield put(fetchCatalogRequest());
  } catch (err) {
    console.error('toggleCityStatus error:', err);
  }
}

function* deleteCityWorker(action) {
  try {
    yield call(AdminApiService.deleteCity, action.payload);
    yield put(fetchCatalogRequest());
  } catch (err) {
    console.error('deleteCity error:', err);
  }
}

function* addNewCarWorker(action) {
  try {
    yield call(AdminApiService.createCarListing, action.payload);
    yield put(fetchListingsRequest());
    yield put(fetchStatsRequest());
  } catch (err) {
    console.error('addNewCar error:', err);
  }
}

export function* adminSaga() {
  yield takeLatest(fetchStatsRequest.type, fetchStatsWorker);
  yield takeLatest(fetchListingsRequest.type, fetchListingsWorker);
  yield takeLatest(fetchUsersRequest.type, fetchUsersWorker);
  yield takeLatest(fetchCatalogRequest.type, fetchCatalogWorker);
  yield takeLatest(fetchLogsRequest.type, fetchLogsWorker);
  yield takeEvery(approveListingRequest.type, approveListingWorker);
  yield takeEvery(rejectListingRequest.type, rejectListingWorker);
  yield takeEvery(toggleFeaturedRequest.type, toggleFeaturedWorker);
  yield takeEvery(deleteListingRequest.type, deleteListingWorker);
  yield takeEvery(toggleUserBlockRequest.type, toggleUserBlockWorker);

  // Brands CRUD & Status
  yield takeLatest(addBrandRequest.type, addBrandWorker);
  yield takeLatest(updateBrandRequest.type, updateBrandWorker);
  yield takeLatest(toggleBrandStatusRequest.type, toggleBrandStatusWorker);
  yield takeLatest(deleteBrandRequest.type, deleteBrandWorker);

  // Categories CRUD & Status
  yield takeLatest(addCategoryRequest.type, addCategoryWorker);
  yield takeLatest(updateCategoryRequest.type, updateCategoryWorker);
  yield takeLatest(toggleCategoryStatusRequest.type, toggleCategoryStatusWorker);
  yield takeLatest(deleteCategoryRequest.type, deleteCategoryWorker);

  // Cities CRUD & Status
  yield takeLatest(addCityRequest.type, addCityWorker);
  yield takeLatest(updateCityRequest.type, updateCityWorker);
  yield takeLatest(toggleCityStatusRequest.type, toggleCityStatusWorker);
  yield takeLatest(deleteCityRequest.type, deleteCityWorker);

  yield takeLatest(addNewCarRequest.type, addNewCarWorker);
}
