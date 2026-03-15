import { call, put, takeLatest } from 'redux-saga/effects';

import { resetDatabase } from '../../data/db/sqlite';
import {
  clearDatabaseFailed,
  clearDatabaseRequested,
  clearDatabaseSucceeded,
} from '../maintenanceSlice';
import { loadCategoriesRequested } from '../categoriesSlice';
import { loadTransactionsRequested } from '../transactionsSlice';

function* handleClearDatabase() {
  try {
    yield call(resetDatabase);
    yield put(clearDatabaseSucceeded());
    yield put(loadCategoriesRequested());
    yield put(loadTransactionsRequested());
  } catch (error) {
    yield put(
      clearDatabaseFailed(
        error instanceof Error ? error.message : 'Unknown error',
      ),
    );
  }
}

export function* maintenanceSaga() {
  yield takeLatest(clearDatabaseRequested.type, handleClearDatabase);
}
