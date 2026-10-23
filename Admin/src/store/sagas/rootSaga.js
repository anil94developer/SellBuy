import { all } from 'redux-saga/effects';
import { adminSaga } from './adminSaga';

export function* rootSaga() {
  yield all([
    adminSaga()
  ]);
}
