import { useEffect, useMemo } from 'react';
import { useIsFocused } from '@react-navigation/native';

import type { Transaction } from '../../types/transactions';
import { strings } from '../../utils/strings';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loadAnalyticsRequested } from '../../store/analyticsSlice';

type AnalysisStatus = 'loading' | 'ready' | 'empty' | 'failed';

export type AnalysisRange = 'month' | 'year';

type ActivityBar = {
  label: string;
  amount: number;
  fullLabel: string;
};

type CategoryBreakdown = {
  key: string;
  label: string;
  emoji: string;
  amount: number;
  count: number;
  progress: number;
};

type AnalysisData = {
  status: AnalysisStatus;
  totalSpent: number;
  deltaPercent: number;
  activityBars: ActivityBar[];
  categoryBreakdown: CategoryBreakdown[];
};

const toNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getRangeStart = (range: AnalysisRange, now: Date) => {
  if (range === 'year') {
    return new Date(now.getFullYear(), 0, 1);
  }
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

const getPreviousRangeStart = (range: AnalysisRange, now: Date) => {
  if (range === 'year') {
    return new Date(now.getFullYear() - 1, 0, 1);
  }
  return new Date(now.getFullYear(), now.getMonth() - 1, 1);
};

const getRangeEnd = (range: AnalysisRange, now: Date) => {
  if (range === 'year') {
    return new Date(now.getFullYear() + 1, 0, 1);
  }
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
};

const getPreviousRangeEnd = (range: AnalysisRange, now: Date) => {
  if (range === 'year') {
    return new Date(now.getFullYear(), 0, 1);
  }
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

const buildMonthBars = (items: Transaction[], now: Date) => {
  const bars: ActivityBar[] = [];
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dayStart = new Date(now.getFullYear(), now.getMonth(), day);
    const dayEnd = new Date(
      dayStart.getFullYear(),
      dayStart.getMonth(),
      dayStart.getDate() + 1,
    );

    const amount = items.reduce((sum, item) => {
      const itemDate = new Date(item.date);
      if (item.type === 'expense' && itemDate >= dayStart && itemDate < dayEnd) {
        return sum + toNumber(item.amount);
      }
      return sum;
    }, 0);

    bars.push({
      label: String(day),
      amount,
      fullLabel: dayStart.toLocaleDateString(strings.transactions.dateLocale, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    });
  }

  return bars;
};

const buildYearBars = (items: Transaction[], now: Date) => {
  const bars: ActivityBar[] = [];

  for (let month = 0; month < 12; month += 1) {
    const monthStart = new Date(now.getFullYear(), month, 1);
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1);

    const amount = items.reduce((sum, item) => {
      const itemDate = new Date(item.date);
      if (item.type === 'expense' && itemDate >= monthStart && itemDate < monthEnd) {
        return sum + toNumber(item.amount);
      }
      return sum;
    }, 0);

    bars.push({
      label: monthStart
        .toLocaleDateString(strings.transactions.dateLocale, {
          month: 'short',
        })
        .toUpperCase(),
      amount,
      fullLabel: monthStart.toLocaleDateString(strings.transactions.dateLocale, {
        month: 'long',
        year: 'numeric',
      }),
    });
  }

  return bars;
};

export const useAnalysis = (range: AnalysisRange): AnalysisData => {
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const { items, status: analyticsStatus } = useAppSelector(
    state => state.analytics,
  );

  useEffect(() => {
    if (isFocused) {
      dispatch(loadAnalyticsRequested());
    }
  }, [dispatch, isFocused]);

  return useMemo(() => {
    const status: AnalysisStatus =
      analyticsStatus === 'loading'
        ? 'loading'
        : analyticsStatus === 'failed'
          ? 'failed'
          : items.length === 0
            ? 'empty'
            : 'ready';

    const now = new Date();
    const rangeStart = getRangeStart(range, now);
    const rangeEnd = getRangeEnd(range, now);
    const previousRangeStart = getPreviousRangeStart(range, now);
    const previousRangeEnd = getPreviousRangeEnd(range, now);

    const rangeTransactions = items.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= rangeStart && itemDate < rangeEnd;
    });

    const previousTransactions = items.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= previousRangeStart && itemDate < previousRangeEnd;
    });

    const totalSpent = rangeTransactions.reduce((sum, item) => {
      if (item.type !== 'expense') {
        return sum;
      }
      return sum + toNumber(item.amount);
    }, 0);

    const previousSpent = previousTransactions.reduce((sum, item) => {
      if (item.type !== 'expense') {
        return sum;
      }
      return sum + toNumber(item.amount);
    }, 0);

    const deltaPercent =
      previousSpent > 0
        ? ((totalSpent - previousSpent) / previousSpent) * 100
        : totalSpent > 0
          ? 100
          : 0;

    const activityBars =
      range === 'year'
        ? buildYearBars(rangeTransactions, now)
        : buildMonthBars(rangeTransactions, now);

    const groupedCategories = rangeTransactions.reduce<
      Record<string, Omit<CategoryBreakdown, 'progress'>>
    >((acc, item) => {
      if (item.type !== 'expense') {
        return acc;
      }

      const key = item.category?.id ?? item.categoryId;
      const current = acc[key] ?? {
        key,
        label:
          item.category?.name ?? strings.transactionsScreen.uncategorized,
        emoji: item.category?.emoji ?? '•',
        amount: 0,
        count: 0,
      };

      current.amount += toNumber(item.amount);
      current.count += 1;
      acc[key] = current;
      return acc;
    }, {});

    const sortedCategories = Object.values(groupedCategories).sort(
      (left, right) => right.amount - left.amount,
    );
    const topAmount = sortedCategories[0]?.amount ?? 0;

    const categoryBreakdown = sortedCategories.map(category => ({
      ...category,
      progress: topAmount > 0 ? category.amount / topAmount : 0,
    }));

    return {
      status,
      totalSpent,
      deltaPercent,
      activityBars,
      categoryBreakdown,
    };
  }, [analyticsStatus, items, range]);
};
