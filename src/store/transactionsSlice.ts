import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { Transaction } from '../types/transactions';

type TransactionsState = {
  items: Transaction[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  lastCreatedId: string | null;
  lastUpdatedId: string | null;
  lastDeletedId: string | null;
  offset: number;
  pageSize: number;
  hasMore: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  monthExpenseTotal: number;
  monthTransactionCount: number;
  monthStatsStatus: 'idle' | 'loading' | 'failed';
  monthStatsError: string | null;
};

const initialState: TransactionsState = {
  items: [],
  status: 'idle',
  error: null,
  lastCreatedId: null,
  lastUpdatedId: null,
  lastDeletedId: null,
  offset: 0,
  pageSize: 20,
  hasMore: true,
  isRefreshing: false,
  isLoadingMore: false,
  monthExpenseTotal: 0,
  monthTransactionCount: 0,
  monthStatsStatus: 'idle',
  monthStatsError: null,
};

const isInCurrentMonth = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const now = new Date();
  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransactionRequested: (state, _action: PayloadAction<Transaction>) => {
      state.status = 'loading';
      state.error = null;
      state.lastCreatedId = null;
    },
    addTransactionSucceeded: (state, action: PayloadAction<Transaction>) => {
      state.status = 'idle';
      state.lastCreatedId = action.payload.id;
      state.items = [
        action.payload,
        ...state.items.filter(item => item.id !== action.payload.id),
      ].sort((left, right) => right.date.localeCompare(left.date));

      if (isInCurrentMonth(action.payload.date)) {
        state.monthTransactionCount += 1;
        if (action.payload.type === 'expense') {
          state.monthExpenseTotal += Number(action.payload.amount) || 0;
        }
      }
    },
    addTransactionFailed: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    updateTransactionRequested: (state, _action: PayloadAction<Transaction>) => {
      state.status = 'loading';
      state.error = null;
      state.lastUpdatedId = null;
    },
    updateTransactionSucceeded: (state, action: PayloadAction<Transaction>) => {
      state.status = 'idle';
      state.lastUpdatedId = action.payload.id;
      state.items = state.items
        .map(item => (item.id === action.payload.id ? action.payload : item))
        .sort((left, right) => right.date.localeCompare(left.date));
    },
    updateTransactionFailed: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    deleteTransactionRequested: (state, _action: PayloadAction<string>) => {
      state.status = 'loading';
      state.error = null;
      state.lastDeletedId = null;
    },
    deleteTransactionSucceeded: (state, action: PayloadAction<string>) => {
      state.status = 'idle';
      state.lastDeletedId = action.payload;
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    deleteTransactionFailed: (state, action: PayloadAction<string>) => {
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
    loadMonthlyStatsRequested: state => {
      state.monthStatsStatus = 'loading';
      state.monthStatsError = null;
    },
    loadMonthlyStatsSucceeded: (
      state,
      action: PayloadAction<{ expenseTotal: number; count: number }>,
    ) => {
      state.monthStatsStatus = 'idle';
      state.monthExpenseTotal = action.payload.expenseTotal;
      state.monthTransactionCount = action.payload.count;
    },
    loadMonthlyStatsFailed: (state, action: PayloadAction<string>) => {
      state.monthStatsStatus = 'failed';
      state.monthStatsError = action.payload;
    },
  },
});

export const {
  addTransactionRequested,
  addTransactionSucceeded,
  addTransactionFailed,
  updateTransactionRequested,
  updateTransactionSucceeded,
  updateTransactionFailed,
  deleteTransactionRequested,
  deleteTransactionSucceeded,
  deleteTransactionFailed,
  loadTransactionsRequested,
  loadTransactionsSucceeded,
  loadTransactionsFailed,
  loadMonthlyStatsRequested,
  loadMonthlyStatsSucceeded,
  loadMonthlyStatsFailed,
} = transactionsSlice.actions;

export const transactionsReducer = transactionsSlice.reducer;
