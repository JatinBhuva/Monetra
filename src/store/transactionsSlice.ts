import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { Transaction } from '../types/transactions';

type TransactionsState = {
  items: Transaction[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  lastCreatedId: string | null;
  offset: number;
  pageSize: number;
  hasMore: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
};

const initialState: TransactionsState = {
  items: [],
  status: 'idle',
  error: null,
  lastCreatedId: null,
  offset: 0,
  pageSize: 20,
  hasMore: true,
  isRefreshing: false,
  isLoadingMore: false,
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
      state.lastCreatedId = action.payload.id;
    },
    addTransactionFailed: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    loadTransactionsRequested: (
      state,
      action: PayloadAction<{ refresh?: boolean; loadMore?: boolean } | undefined>,
    ) => {
      const refresh = action.payload?.refresh;
      const loadMore = action.payload?.loadMore;
      if (loadMore) {
        state.isLoadingMore = true;
      } else if (refresh) {
        state.isRefreshing = true;
      } else {
        state.status = 'loading';
      }
      state.error = null;
    },
    loadTransactionsSucceeded: (
      state,
      action: PayloadAction<{
        items: Transaction[];
        refresh: boolean;
        hasMore: boolean;
        nextOffset: number;
      }>,
    ) => {
      state.status = 'idle';
      if (action.payload.refresh) {
        state.items = action.payload.items;
      } else {
        state.items = [...state.items, ...action.payload.items];
      }
      state.hasMore = action.payload.hasMore;
      state.offset = action.payload.nextOffset;
      state.isRefreshing = false;
      state.isLoadingMore = false;
    },
    loadTransactionsFailed: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
      state.isRefreshing = false;
      state.isLoadingMore = false;
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
