import { all } from 'redux-saga/effects';
import { carsSaga } from './carsSaga';
import { metaSaga } from './metaSaga';
import { chatSaga } from './chatSaga';
import { authSaga } from './authSaga';

export function* rootSaga() {
  yield all([
    carsSaga(),
    metaSaga(),
    chatSaga(),
    authSaga()
  ]);
}
