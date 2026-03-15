import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { Category } from '../types/categories';

type CategoriesState = {
  items: Category[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
};

const initialState: CategoriesState = {
  items: [],
  status: 'idle',
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    loadCategoriesRequested: state => {
      state.status = 'loading';
      state.error = null;
    },
    loadCategoriesSucceeded: (state, action: PayloadAction<Category[]>) => {
      state.status = 'idle';
      state.items = action.payload;
    },
    loadCategoriesFailed: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    addCategoryRequested: (state, _action: PayloadAction<Category>) => {
      state.status = 'loading';
      state.error = null;
    },
    addCategorySucceeded: (state, action: PayloadAction<Category>) => {
      state.status = 'idle';
      state.items = [action.payload, ...state.items];
    },
    addCategoryFailed: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    removeCategoryRequested: (state, _action: PayloadAction<string>) => {
      state.status = 'loading';
      state.error = null;
    },
    removeCategorySucceeded: (state, action: PayloadAction<string>) => {
      state.status = 'idle';
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    removeCategoryFailed: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

export const {
  loadCategoriesRequested,
  loadCategoriesSucceeded,
  loadCategoriesFailed,
  addCategoryRequested,
  addCategorySucceeded,
  addCategoryFailed,
  removeCategoryRequested,
  removeCategorySucceeded,
  removeCategoryFailed,
} = categoriesSlice.actions;

export const categoriesReducer = categoriesSlice.reducer;
