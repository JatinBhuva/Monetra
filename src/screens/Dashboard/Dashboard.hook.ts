import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { DeviceEventEmitter } from 'react-native';

import { loadMonthlyStatsRequested, loadTransactionsRequested } from '../../store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { strings } from '../../utils/strings';
import { investmentRepository } from '../../data/repositories/investmentRepository';
import { INVESTMENT_CREATED_EVENT } from '../../utils/events';

export const useDashboard = () => {
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const [monthInvestmentTotal, setMonthInvestmentTotal] = useState(0);
  const {
    items,
    status,
    monthExpenseTotal,
    monthTransactionCount,
    monthStatsStatus,
  } = useAppSelector(state => state.transactions);

  const loadMonthInvestmentTotal = useCallback(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    investmentRepository
      .getMonthlyTotal({ startDate: start.toISOString(), endDate: end.toISOString() })
      .then(total => setMonthInvestmentTotal(total))
      .catch(() => setMonthInvestmentTotal(0));
  }, []);

  useEffect(() => {
    dispatch(loadTransactionsRequested());
    dispatch(loadMonthlyStatsRequested());
    loadMonthInvestmentTotal();
  }, [dispatch, loadMonthInvestmentTotal]);

  useEffect(() => {
    if (isFocused) {
      loadMonthInvestmentTotal();
    }
  }, [isFocused, loadMonthInvestmentTotal]);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      INVESTMENT_CREATED_EVENT,
      () => {
        loadMonthInvestmentTotal();
      },
    );

    return () => {
      subscription.remove();
    };
  }, [loadMonthInvestmentTotal]);

  const refresh = useCallback(() => {
    dispatch(loadTransactionsRequested({ refresh: true }));
    dispatch(loadMonthlyStatsRequested());
    loadMonthInvestmentTotal();
  }, [dispatch, loadMonthInvestmentTotal]);

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
    monthInvestmentTotal,
    monthTransactionCount,
    recentTransactions,
    monthLabel,
    refresh,
  };
};
