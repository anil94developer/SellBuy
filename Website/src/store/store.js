import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import carsReducer from './slices/carsSlice';
import metaReducer from './slices/metaSlice';
import chatReducer from './slices/chatSlice';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import { rootSaga } from './sagas/rootSaga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    cars: carsReducer,
    meta: metaReducer,
    chat: chatReducer,
    auth: authReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false
    }).concat(sagaMiddleware)
});

sagaMiddleware.run(rootSaga);

export default store;
