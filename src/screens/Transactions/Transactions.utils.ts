import { strings } from '../../utils/strings';
import type { Transaction } from '../../types/transactions';

export type TransactionListItem =
  | {
      kind: 'monthHeader';
      id: string;
      label: string;
      total: string;
      monthKey: string;
      startDate: string;
      endDate: string;
    }
  | { kind: 'header'; id: string; label: string }
  | { kind: 'transaction'; id: string; transaction: Transaction };

const pad2 = (value: number) => String(value).padStart(2, '0');

const getDateKey = (date: Date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

const parseDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date(0) : date;
};

const getDateLabel = (date: Date, todayKey: string, tomorrowKey: string) => {
  const dateKey = getDateKey(date);
  if (dateKey === todayKey) {
    return strings.transactionsScreen.today;
  }
  if (dateKey === tomorrowKey) {
    return strings.transactionsScreen.tomorrow;
  }
  return date.toLocaleDateString(strings.transactions.dateLocale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatTransactionAmount = (amount: string) => {
  const value = Number(amount);
  if (!Number.isFinite(value)) {
    return amount;
  }
  return value.toLocaleString(strings.transactions.dateLocale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const getMonthKey = (date: Date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;

const getMonthLabel = (date: Date) =>
  date.toLocaleDateString(strings.transactions.dateLocale, {
    month: 'long',
    year: 'numeric',
  });

const getMonthRange = (monthKey: string) => {
  const [year, month] = monthKey.split('-').map(Number);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  };
};

export const matchesTransactionSearch = (
  transaction: Transaction,
  searchValue: string,
) => {
  const query = searchValue.trim().toLowerCase();
  if (!query) {
    return true;
  }

  const dateLabel = parseDate(transaction.date)
    .toLocaleDateString(strings.transactions.dateLocale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .toLowerCase();

  return (
    transaction.description.toLowerCase().includes(query) ||
    transaction.type.toLowerCase().includes(query) ||
    (transaction.category?.name ?? '').toLowerCase().includes(query) ||
    dateLabel.includes(query)
  );
};

export const buildTransactionListData = (
  filteredItems: Transaction[],
): TransactionListItem[] => {
  if (!filteredItems.length) {
    return [];
  }
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const todayKey = getDateKey(today);
  const tomorrowKey = getDateKey(tomorrow);

  const data: TransactionListItem[] = [];
  let lastDateKey = '';
  let lastMonthKey = '';

  const monthTotals = filteredItems.reduce<Record<string, number>>((acc, item) => {
    const date = parseDate(item.date);
    const monthKey = getMonthKey(date);
    if (item.type === 'expense') {
      const value = Number(item.amount);
      acc[monthKey] = (acc[monthKey] ?? 0) + (Number.isFinite(value) ? value : 0);
    }
    return acc;
  }, {});

  for (const transaction of filteredItems) {
    const date = parseDate(transaction.date);
    const dateKey = getDateKey(date);
    const monthKey = getMonthKey(date);
    const range = getMonthRange(monthKey);
    if (monthKey !== lastMonthKey) {
      data.push({
        kind: 'monthHeader',
        id: `month-${monthKey}`,
        label: getMonthLabel(date),
        total: formatTransactionAmount(String(monthTotals[monthKey] ?? 0)),
        monthKey,
        startDate: range.startDate,
        endDate: range.endDate,
      });
      lastMonthKey = monthKey;
      lastDateKey = '';
    }
    if (dateKey !== lastDateKey) {
      data.push({
        kind: 'header',
        id: `header-${dateKey}`,
        label: getDateLabel(date, todayKey, tomorrowKey),
      });
      lastDateKey = dateKey;
    }
    data.push({
      kind: 'transaction',
      id: transaction.id,
      transaction,
    });
  }

  return data;
};
