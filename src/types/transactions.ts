import type { Category } from './categories';

export type TransactionType = 'expense' | 'income';

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: string;
  description: string;
  categoryId: string;
  date: string;
  category?: Category;
};
