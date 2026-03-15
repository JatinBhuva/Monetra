import { useEffect, useMemo } from 'react';
import { useIsFocused } from '@react-navigation/native';

import type { Transaction } from '../../types/transactions';
import { strings } from '../../utils/strings';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loadAnalyticsRequested } from '../../store/analyticsSlice';

type AnalysisStatus = 'loading' | 'ready' | 'empty' | 'failed';

type LineSeries = {
  values: number[];
  labels: string[];
  average: number;
  peakLabel: string;
};

type CategoryMix = {
  label: string;
  value: number;
  amount: number;
  color: string;
};

type WeeklyCashflow = {
  label: string;
  income: number;
  expense: number;
};

type AnalysisData = {
  status: AnalysisStatus;
  lineSeries: LineSeries;
  categoryMix: CategoryMix[];
  weeklyCashflow: WeeklyCashflow[];
  averages: {
    income: number;
    expense: number;
  };
  summary: {
    rangeLabel: string;
    monthLabel: string;
    monthExpenseTotal: number;
    monthIncomeTotal: number;
    savingsRate: number;
  };
  insight: {
    title: string;
    body: string;
    chips: string[];
  };
};

const CHART_COLORS = ['#3A6EA5', '#F2B880', '#9A6DD7', '#7BC7A0'];

const toNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const startOfWeek = (date: Date) => {
  const day = date.getDay();
  const diff = date.getDate() - day;
  return new Date(date.getFullYear(), date.getMonth(), diff);
};

const formatMonthLabel = (date: Date) =>
  date.toLocaleDateString(strings.transactions.dateLocale, {
    month: 'long',
    year: 'numeric',
  });

const formatShortWeek = (date: Date) =>
  date.toLocaleDateString(strings.transactions.dateLocale, {
    day: '2-digit',
    month: 'short',
  });

const formatShortDay = (date: Date) =>
  date.toLocaleDateString(strings.transactions.dateLocale, {
    weekday: 'short',
  });

const getCategoryLabel = (transaction: Transaction) =>
  transaction.category?.name ?? strings.transactionsScreen.uncategorized;

export type AnalysisRange = 'week' | 'month' | 'year';

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
    const rangeDays = range === 'week' ? 7 : range === 'year' ? 365 : 30;
    const rangeStart = new Date(now);
    rangeStart.setDate(rangeStart.getDate() - rangeDays);

    const rangeTransactions = items.filter(item => {
      const date = new Date(item.date);
      return date >= rangeStart && date <= now;
    });

    const rangeExpenseTotal = rangeTransactions.reduce((sum, item) => {
      if (item.type !== 'expense') {
        return sum;
      }
      return sum + toNumber(item.amount);
    }, 0);

    const rangeIncomeTotal = rangeTransactions.reduce((sum, item) => {
      if (item.type !== 'income') {
        return sum;
      }
      return sum + toNumber(item.amount);
    }, 0);

    const savingsRate =
      rangeIncomeTotal > 0
        ? ((rangeIncomeTotal - rangeExpenseTotal) / rangeIncomeTotal) * 100
        : 0;

    const buildDailyTotals = (daysCount: number) => {
      const days: Date[] = [];
      for (let i = daysCount - 1; i >= 0; i -= 1) {
        const date = startOfDay(new Date(now));
        date.setDate(date.getDate() - i);
        days.push(date);
      }

      const totals = days.map(day => {
        const next = new Date(day);
        next.setDate(day.getDate() + 1);
        return items.reduce((sum, item) => {
          if (item.type !== 'expense') {
            return sum;
          }
          const date = new Date(item.date);
          if (date >= day && date < next) {
            return sum + toNumber(item.amount);
          }
          return sum;
        }, 0);
      });

      return { days, totals };
    };

    const buildMonthlyTotals = (monthsCount: number) => {
      const months: Date[] = [];
      for (let i = monthsCount - 1; i >= 0; i -= 1) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push(date);
      }

      const totals = months.map(monthStart => {
        const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1);
        return items.reduce((sum, item) => {
          if (item.type !== 'expense') {
            return sum;
          }
          const date = new Date(item.date);
          if (date >= monthStart && date < monthEnd) {
            return sum + toNumber(item.amount);
          }
          return sum;
        }, 0);
      });

      return { months, totals };
    };

    let lineSeries: LineSeries;

    if (range === 'year') {
      const { months, totals } = buildMonthlyTotals(12);
      const average =
        totals.length > 0 ? totals.reduce((sum, value) => sum + value, 0) / totals.length : 0;
      const peakIndex = totals.reduce(
        (maxIndex, value, index, array) =>
          value > array[maxIndex] ? index : maxIndex,
        0,
      );

      lineSeries = {
        values: totals,
        labels: months.map(date =>
          date.toLocaleDateString(strings.transactions.dateLocale, { month: 'short' }),
        ),
        average,
        peakLabel:
          totals[peakIndex] > 0
            ? months[peakIndex].toLocaleDateString(strings.transactions.dateLocale, {
                month: 'short',
              })
            : '--',
      };
    } else {
      const { days, totals } = buildDailyTotals(range === 'week' ? 7 : 30);
      const average =
        totals.length > 0 ? totals.reduce((sum, value) => sum + value, 0) / totals.length : 0;
      const peakIndex = totals.reduce(
        (maxIndex, value, index, array) =>
          value > array[maxIndex] ? index : maxIndex,
        0,
      );

      lineSeries = {
        values: totals,
        labels: days.map(day => formatShortDay(day)),
        average,
        peakLabel:
          totals[peakIndex] > 0
            ? days[peakIndex].toLocaleDateString(strings.transactions.dateLocale, {
                weekday: 'short',
              })
            : '--',
      };
    }

    const categoryTotals = items.reduce<Record<string, { amount: number; label: string }>>(
      (acc, item) => {
        const date = new Date(item.date);
        if (item.type !== 'expense' || date < rangeStart) {
          return acc;
        }
        const label = getCategoryLabel(item);
        const current = acc[label] ?? { amount: 0, label };
        current.amount += toNumber(item.amount);
        acc[label] = current;
        return acc;
      },
      {},
    );

    const categoryEntries = Object.values(categoryTotals).sort(
      (a, b) => b.amount - a.amount,
    );
    const categoryTotalAmount = categoryEntries.reduce(
      (sum, item) => sum + item.amount,
      0,
    );

    const categoryMix = categoryEntries.slice(0, 4).map((item, index) => ({
      label: item.label,
      amount: item.amount,
      value:
        categoryTotalAmount > 0
          ? Math.round((item.amount / categoryTotalAmount) * 100)
          : 0,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));

    const cashflowBuckets: WeeklyCashflow[] = [];
    if (range === 'week') {
      const { days } = buildDailyTotals(7);
      days.forEach(day => {
        const next = new Date(day);
        next.setDate(day.getDate() + 1);
        const { income, expense } = items.reduce(
          (acc, item) => {
            const date = new Date(item.date);
            if (date >= day && date < next) {
              const amount = toNumber(item.amount);
              if (item.type === 'income') {
                acc.income += amount;
              } else if (item.type === 'expense') {
                acc.expense += amount;
              }
            }
            return acc;
          },
          { income: 0, expense: 0 },
        );
        cashflowBuckets.push({
          label: formatShortDay(day),
          income,
          expense,
        });
      });
    } else if (range === 'year') {
      for (let i = 11; i >= 0; i -= 1) {
        const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
        const { income, expense } = items.reduce(
          (acc, item) => {
            const date = new Date(item.date);
            if (date >= start && date < end) {
              const amount = toNumber(item.amount);
              if (item.type === 'income') {
                acc.income += amount;
              } else if (item.type === 'expense') {
                acc.expense += amount;
              }
            }
            return acc;
          },
          { income: 0, expense: 0 },
        );
        cashflowBuckets.push({
          label: start.toLocaleDateString(strings.transactions.dateLocale, {
            month: 'short',
          }),
          income,
          expense,
        });
      }
    } else {
      const weekStart = startOfWeek(now);
      for (let i = 4; i >= 0; i -= 1) {
        const start = new Date(weekStart);
        start.setDate(start.getDate() - i * 7);
        const end = new Date(start);
        end.setDate(start.getDate() + 7);
        const { income, expense } = items.reduce(
          (acc, item) => {
            const date = new Date(item.date);
            if (date >= start && date < end) {
              const amount = toNumber(item.amount);
              if (item.type === 'income') {
                acc.income += amount;
              } else if (item.type === 'expense') {
                acc.expense += amount;
              }
            }
            return acc;
          },
          { income: 0, expense: 0 },
        );
        cashflowBuckets.push({
          label: formatShortWeek(start),
          income,
          expense,
        });
      }
    }

    const avgIncome =
      cashflowBuckets.length > 0
        ? cashflowBuckets.reduce((sum, item) => sum + item.income, 0) /
          cashflowBuckets.length
        : 0;
    const avgExpense =
      cashflowBuckets.length > 0
        ? cashflowBuckets.reduce((sum, item) => sum + item.expense, 0) /
          cashflowBuckets.length
        : 0;

    const rangeDescriptor =
      range === 'week' ? 'last 7 days' : range === 'year' ? 'last 12 months' : 'last 30 days';
    const topCategory = categoryMix[0];
    const insight = topCategory
      ? {
          title: 'Insight of the month',
          body: `${topCategory.label} leads your spending at ${topCategory.value}% over the ${rangeDescriptor}.`,
          chips: ['Category leader', rangeDescriptor.replace('last', 'Last')],
        }
      : {
          title: 'Insight of the month',
          body: 'Add a few transactions to unlock personalized insights.',
          chips: ['Get started'],
        };

    return {
      status,
      lineSeries,
      categoryMix,
      weeklyCashflow: cashflowBuckets,
      averages: {
        income: avgIncome,
        expense: avgExpense,
      },
      summary: {
        rangeLabel:
          range === 'week'
            ? 'This week'
            : range === 'year'
              ? 'Last 12 months'
              : 'Last 30 days',
        monthLabel: formatMonthLabel(now),
        monthExpenseTotal: rangeExpenseTotal,
        monthIncomeTotal: rangeIncomeTotal,
        savingsRate,
      },
      insight: {
        ...insight,
        chips: insight.chips,
      },
    };
  }, [analyticsStatus, items, range]);
};
