import { call, put, select, takeLatest } from 'redux-saga/effects';

import type { Transaction } from '../../types/transactions';
import { transactionRepository } from '../../data/repositories/transactionRepository';
import type { RootState } from '../store';
import {
  addTransactionFailed,
  addTransactionRequested,
  addTransactionSucceeded,
  loadTransactionsFailed,
  loadTransactionsRequested,
  loadTransactionsSucceeded,
} from '../transactionsSlice';

function* handleAddTransaction(action: { payload: Transaction }) {
  try {
    yield call([transactionRepository, transactionRepository.create], action.payload);
    yield put(addTransactionSucceeded(action.payload));
    yield put(loadTransactionsRequested({ refresh: true }));
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

export function* transactionsSaga() {
  yield takeLatest(addTransactionRequested.type, handleAddTransaction);
  yield takeLatest(loadTransactionsRequested.type, handleLoadTransactions);
}
