import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import { categoriesReducer } from './categoriesSlice';
import { analyticsReducer } from './analyticsSlice';
import { maintenanceReducer } from './maintenanceSlice';
import { transactionsReducer } from './transactionsSlice';
import { uiReducer } from './uiSlice';
import { rootSaga } from './sagas/rootSaga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    analytics: analyticsReducer,
    categories: categoriesReducer,
    maintenance: maintenanceReducer,
    transactions: transactionsReducer,
    ui: uiReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
