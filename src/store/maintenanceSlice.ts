import { createSlice } from '@reduxjs/toolkit';

type MaintenanceState = {
  clearStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: MaintenanceState = {
  clearStatus: 'idle',
  error: null,
};

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    clearDatabaseRequested: state => {
      state.clearStatus = 'loading';
      state.error = null;
    },
    clearDatabaseSucceeded: state => {
      state.clearStatus = 'succeeded';
    },
    clearDatabaseFailed: (state, action) => {
      state.clearStatus = 'failed';
      state.error = action.payload;
    },
    clearDatabaseReset: state => {
      state.clearStatus = 'idle';
      state.error = null;
    },
  },
});

export const {
  clearDatabaseRequested,
  clearDatabaseSucceeded,
  clearDatabaseFailed,
  clearDatabaseReset,
} = maintenanceSlice.actions;

export const maintenanceReducer = maintenanceSlice.reducer;
