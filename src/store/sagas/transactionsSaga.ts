import { call, put, select, takeLatest } from 'redux-saga/effects';

import type { Transaction } from '../../types/transactions';
import { transactionRepository } from '../../data/repositories/transactionRepository';
import type { RootState } from '../store';
import {
  loadAnalyticsRequested,
} from '../analyticsSlice';
import {
  addTransactionFailed,
  addTransactionRequested,
  addTransactionSucceeded,
  updateTransactionFailed,
  updateTransactionRequested,
  updateTransactionSucceeded,
  deleteTransactionFailed,
  deleteTransactionRequested,
  deleteTransactionSucceeded,
  loadTransactionsFailed,
  loadTransactionsRequested,
  loadTransactionsSucceeded,
  loadMonthlyStatsRequested,
  loadMonthlyStatsSucceeded,
  loadMonthlyStatsFailed,
} from '../transactionsSlice';

function* handleAddTransaction(action: { payload: Transaction }) {
  try {
    yield call([transactionRepository, transactionRepository.create], action.payload);
    yield put(addTransactionSucceeded(action.payload));
    yield put(loadTransactionsRequested({ refresh: true }));
    yield put(loadMonthlyStatsRequested());
    yield put(loadAnalyticsRequested());
  } catch (error) {
    yield put(
      addTransactionFailed(
        error instanceof Error ? error.message : 'Unknown error',
      ),
    );
  }
}

function* handleLoadTransactions(
  action: ReturnType<typeof loadTransactionsRequested>,
) {
  try {
    const refresh = action.payload?.refresh ?? false;
    const loadMore = action.payload?.loadMore ?? false;
    const { offset, pageSize } = (yield select(
      (state: RootState) => state.transactions,
    )) as RootState['transactions'];

    const nextOffset = loadMore && !refresh ? offset : 0;
    const items: Transaction[] = yield call([
      transactionRepository,
      transactionRepository.list,
    ], {
      limit: pageSize,
      offset: nextOffset,
    });

    yield put(
      loadTransactionsSucceeded({
        items,
        refresh: !loadMore || refresh,
        hasMore: items.length === pageSize,
        nextOffset: nextOffset + items.length,
      }),
    );
  } catch (error) {
    yield put(
      loadTransactionsFailed(
        error instanceof Error ? error.message : 'Unknown error',
      ),
    );
  }
}

function* handleUpdateTransaction(action: { payload: Transaction }) {
  try {
    yield call([transactionRepository, transactionRepository.update], action.payload);
    yield put(updateTransactionSucceeded(action.payload));
    yield put(loadTransactionsRequested({ refresh: true }));
    yield put(loadMonthlyStatsRequested());
    yield put(loadAnalyticsRequested());
  } catch (error) {
    yield put(
      updateTransactionFailed(
        error instanceof Error ? error.message : 'Unknown error',
      ),
    );
  }
}

function* handleDeleteTransaction(action: { payload: string }) {
  try {
    yield call([transactionRepository, transactionRepository.remove], action.payload);
    yield put(deleteTransactionSucceeded(action.payload));
    yield put(loadTransactionsRequested({ refresh: true }));
    yield put(loadMonthlyStatsRequested());
    yield put(loadAnalyticsRequested());
  } catch (error) {
    yield put(
      deleteTransactionFailed(
        error instanceof Error ? error.message : 'Unknown error',
      ),
    );
  }
}

function* handleLoadMonthlyStats() {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const stats: {
      expenseTotal: number;
      incomeTotal: number;
      count: number;
    } = yield call([transactionRepository, transactionRepository.getMonthlyStats], {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    });

    yield put(
      loadMonthlyStatsSucceeded({
        expenseTotal: stats.expenseTotal,
        count: stats.count,
      }),
    );
  } catch (error) {
    yield put(
      loadMonthlyStatsFailed(
        error instanceof Error ? error.message : 'Unknown error',
      ),
    );
  }
}

export function* transactionsSaga() {
  yield takeLatest(addTransactionRequested.type, handleAddTransaction);
  yield takeLatest(updateTransactionRequested.type, handleUpdateTransaction);
  yield takeLatest(deleteTransactionRequested.type, handleDeleteTransaction);
  yield takeLatest(loadTransactionsRequested.type, handleLoadTransactions);
  yield takeLatest(loadMonthlyStatsRequested.type, handleLoadMonthlyStats);
}
