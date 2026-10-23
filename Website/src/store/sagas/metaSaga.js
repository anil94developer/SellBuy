import { call, put, takeLatest, all } from 'redux-saga/effects';
import { ApiService } from '../../models/ApiService';
import {
  fetchMetaRequest,
  fetchMetaSuccess,
  fetchMetaFailure
} from '../slices/metaSlice';

function* fetchMetaWorker() {
  try {
    const [bRes, cRes] = yield all([
      call(ApiService.getBrands),
      call(ApiService.getCities)
    ]);

    const brands = bRes && bRes.brands ? bRes.brands : [];
    const cities = cRes && cRes.cities ? cRes.cities : [];

    yield put(fetchMetaSuccess({ brands, cities }));
  } catch (err) {
    yield put(fetchMetaFailure(err.message || 'Failed to fetch metadata'));
  }
}

export function* metaSaga() {
  yield takeLatest(fetchMetaRequest.type, fetchMetaWorker);
}
