import type { Category } from '../types/categories';
import { strings } from './strings';

const labelMap: Record<string, string> = {
  'categories.expense.food': strings.categories.expense.food,
  'categories.expense.transport': strings.categories.expense.transport,
  'categories.expense.shopping': strings.categories.expense.shopping,
  'categories.expense.entertainment': strings.categories.expense.entertainment,
  'categories.expense.bills': strings.categories.expense.bills,
  'categories.expense.health': strings.categories.expense.health,
  'categories.expense.other': strings.categories.expense.other,
  'categories.income.salary': strings.categories.income.salary,
  'categories.income.freelance': strings.categories.income.freelance,
  'categories.income.other': strings.categories.income.other,
};

export const resolveCategoryLabel = (category: Category) => {
  if (category.labelKey && labelMap[category.labelKey]) {
    return labelMap[category.labelKey];
  }
  return category.name;
};
