import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { assets } from '../../assets';
import { ScreenHeader } from '../../components';
import { resolveCategoryLabel } from '../../utils/categoryLabel';
import { useDashboard } from './Dashboard.hook';
import { strings } from '../../utils/strings';
import { spacing, useThemedStyles } from '../../theme';
import { useTabBarSpacing } from '../../hooks/useTabBarSpacing';
import { ScreenConstants } from '../../utils/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStyles } from './styles';

const DashboardIcon = assets.icons.dashboard;

const formatAmount = (amount: number) =>
  amount.toLocaleString(strings.transactions.dateLocale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const formatRelativeDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.toUpperCase();
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffInDays = Math.round(
    (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffInDays <= 0) {
    return strings.dashboardScreen.todayUpper;
  }
  if (diffInDays === 1) {
    return strings.dashboardScreen.yesterdayUpper;
  }
  return `${diffInDays} ${strings.dashboardScreen.daysAgoSuffix}`;
};

const DashboardScreen = () => {
  const styles = useThemedStyles(createStyles);
  const navigation = useNavigation();
  const {
    status,
    monthStatsStatus,
    monthExpenseTotal,
    monthIncomeTotal,
    monthTransactionCount,
    recentTransactions,
    monthLabel,
  } = useDashboard();
  const tabBarSpacing = useTabBarSpacing(spacing.lg);

  const isLoading =
    status === 'loading' &&
    monthStatsStatus === 'loading' &&
    !recentTransactions.length;

  const spendingAmount = useMemo(
    () => formatAmount(monthExpenseTotal),
    [monthExpenseTotal],
  );
  const investmentTeaserAmount = useMemo(
    () => formatAmount(monthIncomeTotal),
    [monthIncomeTotal],
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: tabBarSpacing },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title={strings.dashboardScreen.title}
          icon={DashboardIcon}
        />

        <View style={styles.summaryGrid}>
          <View style={[styles.summaryTile, styles.summaryTilePrimary]}>
            <View style={styles.summaryTileTop}>
              <Text style={styles.summaryTileEyebrow}>Spend</Text>
              <View style={[styles.summaryBadge, styles.summaryBadgeLight]}>
                <Text style={styles.summaryBadgeText}>{monthLabel}</Text>
              </View>
            </View>
            <Text style={styles.summaryTileTitle}>
              {strings.dashboardScreen.spendingTitle}
            </Text>
            {monthStatsStatus === 'loading' ? (
              <ActivityIndicator size="small" color={styles.sectionTitle.color} />
            ) : (
              <Text style={styles.summaryTileAmount}>
                {strings.transactions.currencySymbol}
                {spendingAmount}
              </Text>
            )}
            <Text style={styles.summaryTileCaption}>
              {monthTransactionCount} entries tracked this month
            </Text>
            <View style={styles.summaryTileIconWrap}>
              <Text style={styles.summaryTileIcon}>↗</Text>
            </View>
          </View>

          <View style={[styles.summaryTile, styles.summaryTileSecondary]}>
            <View style={styles.summaryTileTop}>
              <Text style={styles.summaryTileEyebrow}>Invest</Text>
              <View style={[styles.summaryBadge, styles.summaryBadgeDark]}>
                <Text style={styles.summaryBadgeTextDark}>Soon</Text>
              </View>
            </View>
            <Text style={styles.summaryTileTitle}>
              {strings.dashboardScreen.investmentTitle}
            </Text>
            <Text
              style={[
                styles.summaryTileAmount,
                styles.summaryTileAmountPositive,
              ]}
            >
              {strings.transactions.currencySymbol}
              {investmentTeaserAmount}
            </Text>
            <Text style={styles.summaryTileCaption}>
              Investment tracking layer not enabled yet
            </Text>
            <View
              style={[
                styles.summaryTileIconWrap,
                styles.summaryTileIconWrapDark,
              ]}
            >
              <Text style={styles.summaryTileIcon}>◎</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {strings.dashboardScreen.recentTitle}
          </Text>
          <Pressable
            onPress={() =>
              navigation.navigate(ScreenConstants.TRANSACTIONS_SCREEN as never)
            }
          >
            <Text style={styles.viewAllText}>
              {strings.dashboardScreen.viewAll}
            </Text>
          </Pressable>
        </View>

        {isLoading ? (
          <View style={styles.fullScreenLoader}>
            <ActivityIndicator size="large" color={styles.viewAllText.color} />
          </View>
        ) : recentTransactions.length === 0 ? (
          <Text style={styles.emptyRecent}>
            {strings.dashboardScreen.emptyRecent}
          </Text>
        ) : (
          <View style={styles.transactionList}>
            {recentTransactions.map(transaction => {
              const categoryName =
                transaction.category?.name ??
                strings.transactionsScreen.uncategorized;
              const title =
                transaction.description.trim() ||
                strings.dashboardScreen.untitledTransaction;
              const amountLabel = `${
                transaction.type === 'expense' ? '-' : '+'
              } ${strings.transactions.currencySymbol}${formatAmount(
                Number(transaction.amount),
              )}`;

              return (
                <View key={transaction.id} style={styles.transactionCard}>
                  <View style={styles.transactionIconBox}>
                    <Text style={styles.transactionIcon}>
                      {transaction.category?.emoji ?? '•'}
                    </Text>
                  </View>
                  <View style={styles.transactionContent}>
                    <Text style={styles.transactionTitle} numberOfLines={1}>
                      {title}
                    </Text>
                    <Text style={styles.transactionMeta} numberOfLines={1}>
                      {resolveCategoryLabel({
                        ...(transaction.category ?? {
                          id: 'uncategorized',
                          type: transaction.type,
                          name: categoryName,
                          emoji: '•',
                          isDefault: false,
                          createdAt: '',
                        }),
                      }).toUpperCase()}{' '}
                      • {formatRelativeDate(transaction.date)}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.transactionAmount,
                      transaction.type === 'income'
                        ? styles.transactionAmountPositive
                        : null,
                    ]}
                  >
                    {amountLabel}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.sectionHeaderAlt}>
          <Text style={styles.sectionTitle}>
            {strings.dashboardScreen.insightTitle}
          </Text>
        </View>

        <View style={styles.insightHero}>
          <Text style={styles.insightBadge}>
            {strings.dashboardScreen.insightBadge}
          </Text>
          <Text style={styles.insightHeadline}>
            {strings.dashboardScreen.insightHeadline}
          </Text>
          <Text style={styles.insightBody}>
            {strings.dashboardScreen.insightBody}
          </Text>
          <Pressable style={styles.insightButton}>
            <Text style={styles.insightButtonText}>
              {strings.dashboardScreen.insightAction}
            </Text>
          </Pressable>
          <View style={styles.insightDecorationOuter} />
          <View style={styles.insightDecorationInner} />
        </View>

        <View style={styles.noteCard}>
          <View style={styles.noteIconWrap}>
            <Text style={styles.noteIcon}>i</Text>
          </View>
          <View style={styles.noteContent}>
            <Text style={styles.noteTitle}>
              {strings.dashboardScreen.noteTitle}
            </Text>
            <Text style={styles.noteBody}>
              {strings.dashboardScreen.noteBody}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
