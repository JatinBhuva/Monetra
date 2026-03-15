import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { Transaction } from '../types/transactions';

type TransactionsState = {
  items: Transaction[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  lastCreatedId: string | null;
};

const initialState: TransactionsState = {
  items: [],
  status: 'idle',
  error: null,
  lastCreatedId: null,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransactionRequested: (state, _action: PayloadAction<Transaction>) => {
      state.status = 'loading';
      state.error = null;
    },
    addTransactionSucceeded: (state, action: PayloadAction<Transaction>) => {
      state.status = 'idle';
      state.items = [action.payload, ...state.items];
      state.lastCreatedId = action.payload.id;
    },
    addTransactionFailed: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    loadTransactionsRequested: state => {
      state.status = 'loading';
      state.error = null;
    },
    loadTransactionsSucceeded: (state, action: PayloadAction<Transaction[]>) => {
      state.status = 'idle';
      state.items = action.payload;
    },
    loadTransactionsFailed: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

export const {
  addTransactionRequested,
  addTransactionSucceeded,
  addTransactionFailed,
  loadTransactionsRequested,
  loadTransactionsSucceeded,
  loadTransactionsFailed,
} = transactionsSlice.actions;

export const transactionsReducer = transactionsSlice.reducer;
