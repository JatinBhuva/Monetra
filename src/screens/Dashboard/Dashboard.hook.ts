import { useCallback, useEffect, useMemo } from 'react';

import { loadMonthlyStatsRequested, loadTransactionsRequested } from '../../store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { strings } from '../../utils/strings';

export const useDashboard = () => {
  const dispatch = useAppDispatch();
  const {
    items,
    status,
    monthExpenseTotal,
    monthTransactionCount,
    monthStatsStatus,
  } = useAppSelector(state => state.transactions);

  useEffect(() => {
    dispatch(loadTransactionsRequested());
    dispatch(loadMonthlyStatsRequested());
  }, [dispatch]);

  const refresh = useCallback(() => {
    dispatch(loadTransactionsRequested({ refresh: true }));
    dispatch(loadMonthlyStatsRequested());
  }, [dispatch]);

  const recentTransactions = useMemo(() => items.slice(0, 5), [items]);
  const monthLabel = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString(strings.transactions.dateLocale, {
      month: 'long',
      year: 'numeric',
    });
  }, []);

  return {
    status,
    monthStatsStatus,
    monthExpenseTotal,
    monthTransactionCount,
    recentTransactions,
    monthLabel,
    refresh,
  };
};
