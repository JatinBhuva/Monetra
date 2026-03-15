import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { Transaction } from '../types/transactions';

type AnalyticsState = {
  items: Transaction[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  lastUpdated: string | null;
};

const initialState: AnalyticsState = {
  items: [],
  status: 'idle',
  error: null,
  lastUpdated: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    loadAnalyticsRequested: state => {
      state.status = 'loading';
      state.error = null;
    },
    loadAnalyticsSucceeded: (state, action: PayloadAction<Transaction[]>) => {
      state.status = 'idle';
      state.items = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    loadAnalyticsFailed: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

export const {
  loadAnalyticsRequested,
  loadAnalyticsSucceeded,
  loadAnalyticsFailed,
} = analyticsSlice.actions;

export const analyticsReducer = analyticsSlice.reducer;
