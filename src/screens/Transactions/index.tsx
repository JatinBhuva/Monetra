import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';

import { TabHeader, TransactionRow } from '../../components';
import { strings } from '../../utils/strings';
import { useTransactions } from './Transactions.hook';
import { getListContentStyle, styles } from './styles';
import type { Transaction } from '../../types/transactions';
import { spacing } from '../../theme';
import { useTabBarSpacing } from '../../hooks/useTabBarSpacing';

type ListItem =
  | { kind: 'monthHeader'; id: string; label: string; total: string }
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
  const { items, status, isRefreshing, isLoadingMore, loadMore, refresh } =
    useTransactions();
  const tabBarSpacing = useTabBarSpacing(spacing.xxl);

  const listData = useMemo<ListItem[]>(() => {
    if (!items.length) {
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

    const monthTotals = items.reduce<Record<string, number>>((acc, item) => {
      const date = parseDate(item.date);
      const monthKey = getMonthKey(date);
      if (item.type === 'expense') {
        const value = Number(item.amount);
        acc[monthKey] =
          (acc[monthKey] ?? 0) + (Number.isFinite(value) ? value : 0);
      }
      return acc;
    }, {});

    for (const transaction of items) {
      const date = parseDate(transaction.date);
      const dateKey = getDateKey(date);
      const monthKey = getMonthKey(date);
      if (monthKey !== lastMonthKey) {
        data.push({
          kind: 'monthHeader',
          id: `month-${monthKey}`,
          label: getMonthLabel(date),
          total: formatAmount(String(monthTotals[monthKey] ?? 0)),
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
  }, [items]);

  const renderItem = useCallback<ListRenderItem<ListItem>>(({ item }) => {
    if (item.kind === 'monthHeader') {
      return (
        <View style={styles.monthHeader}>
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
        </View>
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
  }, []);

  const isInitialLoading = status === 'loading' && items.length === 0;

  return (
    <View style={styles.container}>
      <TabHeader
        title={strings.transactionsScreen.title}
        subtitle={strings.transactionsScreen.subtitle}
      />
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
          contentContainerStyle={getListContentStyle(tabBarSpacing)}
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
    </View>
  );
};

export default TransactionsScreen;
