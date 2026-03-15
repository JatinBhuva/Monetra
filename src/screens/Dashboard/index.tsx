import React, { useMemo } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

import { FlashList } from '@shopify/flash-list';

import { useDashboard } from './Dashboard.hook';
import { styles } from './styles';
import { strings } from '../../utils/strings';
import type { Transaction } from '../../types/transactions';

const formatAmount = (amount: number) =>
  amount.toLocaleString(strings.transactions.dateLocale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString(strings.transactions.dateLocale, {
    day: '2-digit',
    month: 'short',
  });
};

const renderRecentItem = ({ item }: { item: Transaction }) => {
  const isExpense = item.type === 'expense';
  const sign = isExpense ? '-' : '+';
  const amountColor = isExpense ? styles.amountExpense : styles.amountIncome;
  const categoryName =
    item.category?.name ?? strings.transactionsScreen.uncategorized;
  const categoryEmoji = item.category?.emoji ?? '•';

  return (
    <View style={styles.recentRow}>
      <View style={styles.recentIcon}>
        <Text style={styles.recentIconText}>{categoryEmoji}</Text>
      </View>
      <View style={styles.recentContent}>
        <Text style={styles.recentTitle} numberOfLines={1}>
          {categoryName}
        </Text>
        <Text style={styles.recentSubtitle} numberOfLines={1}>
          {item.description}
        </Text>
      </View>
      <View style={styles.recentMeta}>
        <Text style={styles.recentDate}>{formatDateTime(item.date)}</Text>
        <Text style={[styles.recentAmount, amountColor]}>
          {sign}
          {strings.transactions.currencySymbol}
          {formatAmount(Number(item.amount))}
        </Text>
      </View>
    </View>
  );
};

const DashboardScreen = () => {
  const {
    status,
    monthStatsStatus,
    monthExpenseTotal,
    recentTransactions,
    monthLabel,
  } = useDashboard();

  const isLoading =
    status === 'loading' && monthStatsStatus === 'loading' && !recentTransactions.length;

  const monthSpend = useMemo(
    () => formatAmount(monthExpenseTotal),
    [monthExpenseTotal],
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{strings.dashboardScreen.title}</Text>
        <Text style={styles.subtitle}>{strings.dashboardScreen.subtitle}</Text>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <Text style={styles.heroLabel}>{strings.dashboardScreen.monthSpendTitle}</Text>
          <Text style={styles.heroMonth}>{monthLabel}</Text>
        </View>
        {monthStatsStatus === 'loading' ? (
          <ActivityIndicator size="small" color={styles.loader.color} />
        ) : (
          <>
            <Text style={styles.heroAmount}>
              {strings.transactions.currencySymbol}
              {monthSpend}
            </Text>
            <Text style={styles.heroSubLabel}>
              {strings.dashboardScreen.monthSpendLabel}
            </Text>
          </>
        )}
      </View>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>{strings.dashboardScreen.recentTitle}</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.fullScreenLoader}>
          <ActivityIndicator size="large" color={styles.loader.color} />
        </View>
      ) : recentTransactions.length === 0 ? (
        <Text style={styles.emptyRecent}>{strings.dashboardScreen.emptyRecent}</Text>
      ) : (
        <FlashList
          data={recentTransactions}
          renderItem={renderRecentItem}
          keyExtractor={item => item.id}
          estimatedItemSize={72}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.recentSeparator} />}
        />
      )}
    </ScrollView>
  );
};

export default DashboardScreen;
