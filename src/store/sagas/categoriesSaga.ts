import { call, put, takeLatest } from 'redux-saga/effects';

import type { Category } from '../../types/categories';
import { categoryRepository } from '../../data/repositories/categoryRepository';
import { categorySeeds } from '../../utils/categorySeeds';
import {
  addCategoryFailed,
  addCategoryRequested,
  loadCategoriesFailed,
  loadCategoriesRequested,
  loadCategoriesSucceeded,
  removeCategoryFailed,
  removeCategoryRequested,
  removeCategorySucceeded,
} from '../categoriesSlice';

function* handleLoadCategories() {
  try {
    const count: number = yield call([
      categoryRepository,
      categoryRepository.count,
    ]);

    if (count === 0) {
      for (const seed of categorySeeds) {
        yield call([categoryRepository, categoryRepository.upsert], seed);
      }
    }

    const items: Category[] = yield call([
      categoryRepository,
      categoryRepository.listAll,
    ]);

    yield put(loadCategoriesSucceeded(items));
  } catch (error) {
    yield put(
      loadCategoriesFailed(
        error instanceof Error ? error.message : 'Unknown error',
      ),
    );
  }
}

function* handleAddCategory(action: { payload: Category }) {
  try {
    yield call([categoryRepository, categoryRepository.upsert], action.payload);
    const items: Category[] = yield call([
      categoryRepository,
      categoryRepository.listAll,
    ]);
    yield put(loadCategoriesSucceeded(items));
  } catch (error) {
    yield put(
      addCategoryFailed(
        error instanceof Error ? error.message : 'Unknown error',
      ),
    );
  }
}

function* handleRemoveCategory(action: { payload: string }) {
  try {
    yield call([categoryRepository, categoryRepository.remove], action.payload);
    yield put(removeCategorySucceeded(action.payload));
  } catch (error) {
    yield put(
      removeCategoryFailed(
        error instanceof Error ? error.message : 'Unknown error',
      ),
    );
  }
}

export function* categoriesSaga() {
  yield takeLatest(loadCategoriesRequested.type, handleLoadCategories);
  yield takeLatest(addCategoryRequested.type, handleAddCategory);
  yield takeLatest(removeCategoryRequested.type, handleRemoveCategory);
}
