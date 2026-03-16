import React, { useMemo } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

import { FlashList } from '@shopify/flash-list';

import { TabHeader, TransactionRow } from '../../components';
import { useDashboard } from './Dashboard.hook';
import { getContentStyle, styles } from './styles';
import { strings } from '../../utils/strings';
import type { Transaction } from '../../types/transactions';
import { spacing } from '../../theme';
import { useTabBarSpacing } from '../../hooks/useTabBarSpacing';

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
  const sign = item.type === 'expense' ? '-' : '+';
  const amountLabel = `${sign}${strings.transactions.currencySymbol}${formatAmount(
    Number(item.amount),
  )}`;

  return (
    <TransactionRow
      transaction={item}
      variant="compact"
      topRightLabel={formatDateTime(item.date)}
      amountLabel={amountLabel}
      amountTone={item.type}
    />
  );
};

const RecentItemSeparator = () => <View style={styles.recentSeparator} />;

const DashboardScreen = () => {
  const {
    status,
    monthStatsStatus,
    monthExpenseTotal,
    recentTransactions,
    monthLabel,
  } = useDashboard();
  const tabBarSpacing = useTabBarSpacing(spacing.lg);

  const isLoading =
    status === 'loading' && monthStatsStatus === 'loading' && !recentTransactions.length;

  const monthSpend = useMemo(
    () => formatAmount(monthExpenseTotal),
    [monthExpenseTotal],
  );

  return (
    <View style={styles.container}>
      <TabHeader
        title={strings.dashboardScreen.title}
        subtitle={strings.dashboardScreen.subtitle}
      />
      <ScrollView
        contentContainerStyle={getContentStyle(tabBarSpacing)}
      >

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
          ItemSeparatorComponent={RecentItemSeparator}
        />
      )}
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;
