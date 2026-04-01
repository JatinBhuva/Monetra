import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CustomInput, ScreenHeader, TransactionRow } from '../../components';
import { assets } from '../../assets';
import { strings } from '../../utils/strings';
import { useTransactions } from './Transactions.hook';
import type { LoggedInStackParamList } from '../../types';
import type { Transaction } from '../../types/transactions';
import { spacing, useThemedStyles } from '../../theme';
import { useTabBarSpacing } from '../../hooks/useTabBarSpacing';
import { ScreenConstants } from '../../utils/constants';
import { createStyles } from './styles';

const TransactionsIcon = assets.icons.transactions;

type ListItem =
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

const formatAmount = (amount: string) => {
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

const matchesSearch = (transaction: Transaction, searchValue: string) => {
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

const EmptyState = () => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyTitle}>
      {strings.transactionsScreen.emptyTitle}
    </Text>
    <Text style={styles.emptyMessage}>
      {strings.transactionsScreen.emptyMessage}
    </Text>
  </View>
);

const TransactionsScreen = () => {
  const styles = useThemedStyles(createStyles);
  const [searchValue, setSearchValue] = useState('');
  const navigation =
    useNavigation<NativeStackNavigationProp<LoggedInStackParamList>>();
  const { items, status, isRefreshing, isLoadingMore, loadMore, refresh } =
    useTransactions();
  const tabBarSpacing = useTabBarSpacing(spacing.xxl);
  const filteredItems = useMemo(
    () => items.filter(item => matchesSearch(item, searchValue)),
    [items, searchValue],
  );

  const listData = useMemo<ListItem[]>(() => {
    if (!filteredItems.length) {
      return [];
    }
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const todayKey = getDateKey(today);
    const tomorrowKey = getDateKey(tomorrow);

    const data: ListItem[] = [];
    let lastDateKey = '';
    let lastMonthKey = '';

    const monthTotals = filteredItems.reduce<Record<string, number>>((acc, item) => {
      const date = parseDate(item.date);
      const monthKey = getMonthKey(date);
      if (item.type === 'expense') {
        const value = Number(item.amount);
        acc[monthKey] =
          (acc[monthKey] ?? 0) + (Number.isFinite(value) ? value : 0);
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
          total: formatAmount(String(monthTotals[monthKey] ?? 0)),
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
  }, [filteredItems]);

  const renderItem: ListRenderItem<ListItem> = ({ item }) => {
    if (item.kind === 'monthHeader') {
      return (
        <Pressable
          style={styles.monthHeader}
          onPress={() =>
            navigation.navigate(ScreenConstants.MONTH_TRANSACTIONS_SCREEN, {
              monthLabel: item.label,
              startDate: item.startDate,
              endDate: item.endDate,
            })
          }
        >
          <Text style={styles.monthTitle}>{item.label}</Text>
          <View style={styles.monthMeta}>
            <Text style={styles.monthMetaLabel}>
              {strings.transactionsScreen.monthTotalLabel}
            </Text>
            <Text style={styles.monthMetaAmount}>
              {strings.transactions.currencySymbol}
              {item.total}
            </Text>
          </View>
          <View style={styles.monthChevron}>
            <Text style={styles.monthChevronIcon}>›</Text>
          </View>
        </Pressable>
      );
    }
    if (item.kind === 'header') {
      return <Text style={styles.dayHeader}>{item.label}</Text>;
    }

    const { transaction } = item;
    const sign = transaction.type === 'expense' ? '-' : '+';
    const amountLabel = `${sign}${
      strings.transactions.currencySymbol
    }${formatAmount(transaction.amount)}`;

    return (
      <View style={styles.rowWrapper}>
        <TransactionRow
          transaction={transaction}
          amountLabel={amountLabel}
          amountTone={transaction.type}
        />
      </View>
    );
  };

  const isInitialLoading = status === 'loading' && items.length === 0;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.headerWrap}>
        <ScreenHeader
          title={strings.transactionsScreen.title}
          icon={TransactionsIcon}
        />
      </View>
      <View style={styles.searchWrap}>
        <CustomInput
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder={strings.transactionsScreen.searchPlaceholder}
          containerStyle={styles.searchInput}
          inputStyle={styles.searchInputText}
        />
      </View>
      {isInitialLoading ? (
        <View style={styles.fullScreenLoader}>
          <ActivityIndicator size="large" color={styles.loader.color} />
        </View>
      ) : (
        <FlashList
          data={listData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          estimatedItemSize={72}
          contentContainerStyle={StyleSheet.flatten([
            styles.listContent,
            { paddingBottom: tabBarSpacing },
          ])}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          onRefresh={refresh}
          refreshing={isRefreshing}
          ListEmptyComponent={EmptyState}
          ListFooterComponent={
            isLoadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={styles.loader.color} />
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
};

export default TransactionsScreen;
