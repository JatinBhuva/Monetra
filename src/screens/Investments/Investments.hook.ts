import { useCallback, useEffect, useMemo, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { investmentRepository } from '../../data/repositories/investmentRepository';
import type { LoggedInStackParamList } from '../../types';
import type { Investment } from '../../types/investments';
import { ScreenConstants } from '../../utils/constants';
import { INVESTMENT_CREATED_EVENT } from '../../utils/events';
import { strings } from '../../utils/strings';

type InvestmentMode = 'month' | 'all';

export const formatInvestmentDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString(strings.transactions.dateLocale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatInvestmentAmount = (amount: string) => {
  const value = Number(amount);
  if (!Number.isFinite(value)) {
    return amount;
  }
  return value.toLocaleString(strings.transactions.dateLocale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

export const useInvestmentsScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<LoggedInStackParamList>>();
  const [mode, setMode] = useState<InvestmentMode>('month');
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [items, setItems] = useState<Investment[]>([]);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      let nextItems: Investment[] = [];
      if (mode === 'month') {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        nextItems = await investmentRepository.listByDateRange({
          startDate: start.toISOString(),
          endDate: end.toISOString(),
        });
      } else {
        nextItems = await investmentRepository.listAll();
      }
      setItems(nextItems);
      setStatus('ready');
    } catch {
      setItems([]);
      setStatus('failed');
    }
  }, [mode]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      INVESTMENT_CREATED_EVENT,
      () => {
        load();
      },
    );

    return () => {
      subscription.remove();
    };
  }, [load]);

  const emptyMessage = useMemo(
    () =>
      mode === 'month'
        ? strings.investments.listEmptyThisMonth
        : strings.investments.listEmptyAll,
    [mode],
  );

  const openInvestmentDetail = (investment: Investment) => {
    navigation.navigate(ScreenConstants.INVESTMENT_DETAIL_SCREEN, {
      investment,
    });
  };

  return {
    mode,
    setMode,
    status,
    items,
    emptyMessage,
    openInvestmentDetail,
  };
};
