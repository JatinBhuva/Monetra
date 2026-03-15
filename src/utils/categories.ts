import { strings } from './strings';

export type CategoryOption = {
  id: string;
  label: string;
  emoji: string;
};

export type TransactionCategorySet = {
  expense: CategoryOption[];
  income: CategoryOption[];
};

export const transactionCategories: TransactionCategorySet = {
  expense: [
    { id: 'food', label: strings.categories.expense.food, emoji: '🍔' },
    { id: 'transport', label: strings.categories.expense.transport, emoji: '🚗' },
    { id: 'shopping', label: strings.categories.expense.shopping, emoji: '🛍️' },
    {
      id: 'entertainment',
      label: strings.categories.expense.entertainment,
      emoji: '🎬',
    },
    { id: 'bills', label: strings.categories.expense.bills, emoji: '💡' },
    { id: 'health', label: strings.categories.expense.health, emoji: '🩺' },
    { id: 'other', label: strings.categories.expense.other, emoji: '📦' },
  ],
  income: [
    { id: 'salary', label: strings.categories.income.salary, emoji: '💼' },
    { id: 'freelance', label: strings.categories.income.freelance, emoji: '🧑‍💻' },
    { id: 'other', label: strings.categories.income.other, emoji: '✨' },
  ],
};
