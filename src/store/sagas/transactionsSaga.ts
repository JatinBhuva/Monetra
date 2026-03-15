import { call, put, takeLatest } from 'redux-saga/effects';

import type { Transaction } from '../../types/transactions';
import { transactionRepository } from '../../data/repositories/transactionRepository';
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
  } catch (error) {
    yield put(
      addTransactionFailed(
        error instanceof Error ? error.message : 'Unknown error',
      ),
    );
  }
}

function* handleLoadTransactions() {
  try {
    const items: Transaction[] = yield call([
      transactionRepository,
      transactionRepository.list,
    ]);
    yield put(loadTransactionsSucceeded(items));
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
