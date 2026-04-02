import { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { LoggedInStackParamList } from '../../types';
import type { Transaction } from '../../types/transactions';
import { ScreenConstants } from '../../utils/constants';
import { useTransactions } from './Transactions.hook';
import {
  buildTransactionListData,
  matchesTransactionSearch,
} from './Transactions.utils';

export const useTransactionsScreen = () => {
  const [searchValue, setSearchValue] = useState('');
  const navigation =
    useNavigation<NativeStackNavigationProp<LoggedInStackParamList>>();
  const { items, status, isRefreshing, isLoadingMore, loadMore, refresh } =
    useTransactions();

  const filteredItems = useMemo(
    () => items.filter(item => matchesTransactionSearch(item, searchValue)),
    [items, searchValue],
  );
  const listData = useMemo(
    () => buildTransactionListData(filteredItems),
    [filteredItems],
  );
  const isInitialLoading = status === 'loading' && items.length === 0;

  const openTransactionDetails = (transaction: Transaction) => {
    navigation.navigate(ScreenConstants.TRANSACTION_DETAIL_SCREEN, {
      transaction,
    });
  };

  const openMonthTransactions = (params: {
    monthLabel: string;
    startDate: string;
    endDate: string;
  }) => {
    navigation.navigate(ScreenConstants.MONTH_TRANSACTIONS_SCREEN, {
      monthLabel: params.monthLabel,
      startDate: params.startDate,
      endDate: params.endDate,
    });
  };

  return {
    searchValue,
    setSearchValue,
    listData,
    isInitialLoading,
    isRefreshing,
    isLoadingMore,
    loadMore,
    refresh,
    openTransactionDetails,
    openMonthTransactions,
  };
};
