import { call, put, takeLatest } from 'redux-saga/effects';

import { transactionRepository } from '../../data/repositories/transactionRepository';
import type { Transaction } from '../../types/transactions';
import {
  loadAnalyticsFailed,
  loadAnalyticsRequested,
  loadAnalyticsSucceeded,
} from '../analyticsSlice';

function* handleLoadAnalytics() {
  try {
    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - 120);

    const items: Transaction[] = yield call([
      transactionRepository,
      transactionRepository.listByDateRange,
    ], {
      startDate: start.toISOString(),
      endDate: now.toISOString(),
    });

    yield put(loadAnalyticsSucceeded(items));
  } catch (error) {
    yield put(
      loadAnalyticsFailed(error instanceof Error ? error.message : 'Unknown error'),
    );
  }
}

export function* analyticsSaga() {
  yield takeLatest(loadAnalyticsRequested.type, handleLoadAnalytics);
}
