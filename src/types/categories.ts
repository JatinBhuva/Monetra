export type CategoryType = 'expense' | 'income';

export type Category = {
  id: string;
  type: CategoryType;
  name: string;
  emoji: string;
  isDefault: boolean;
  labelKey?: string | null;
  createdAt: string;
};
