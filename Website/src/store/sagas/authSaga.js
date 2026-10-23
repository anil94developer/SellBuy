import { call, put, takeLatest } from 'redux-saga/effects';
import { ApiService } from '../../models/ApiService';
import {
  sendOtpRequest,
  sendOtpSuccess,
  sendOtpFailure,
  verifyOtpRequest,
  verifyOtpSuccess,
  verifyOtpFailure,
  logout
} from '../slices/authSlice';

function* sendOtpWorker(action) {
  try {
    const res = yield call(ApiService.sendOtp, action.payload);
    yield put(sendOtpSuccess(res));
  } catch (err) {
    yield put(sendOtpFailure(err.message || 'Failed to send OTP'));
  }
}

function* verifyOtpWorker(action) {
  try {
    const { phone, otp } = action.payload;
    const res = yield call(ApiService.verifyOtp, phone, otp);
    if (res.success) {
      yield put(verifyOtpSuccess(res));
    } else {
      yield put(verifyOtpFailure(res.message || 'Invalid OTP code'));
    }
  } catch (err) {
    yield put(verifyOtpFailure(err.message || 'OTP verification failed'));
  }
}

function* logoutWorker() {
  try {
    yield call(ApiService.logout);
  } catch (err) {
    console.error('Logout error:', err);
  }
}

export function* authSaga() {
  yield takeLatest(sendOtpRequest.type, sendOtpWorker);
  yield takeLatest(verifyOtpRequest.type, verifyOtpWorker);
  yield takeLatest(logout.type, logoutWorker);
}
