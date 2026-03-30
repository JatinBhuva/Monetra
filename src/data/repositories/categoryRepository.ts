import type { Category } from '../../types/categories';
import { LocalCategoryRepository } from './categoryRepository.local';

export type CategoryRepository = {
  listAll: () => Promise<Category[]>;
  upsert: (category: Category) => Promise<void>;
  remove: (id: string) => Promise<void>;
  count: () => Promise<number>;
  getUsageCounts: () => Promise<Record<string, number>>;
};

export const categoryRepository: CategoryRepository =
  new LocalCategoryRepository();
