import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CustomInput, ScreenHeader, TransactionRow } from '../../components';
import { assets } from '../../assets';
import { transactionRepository } from '../../data/repositories/transactionRepository';
import type { Transaction } from '../../types/transactions';
import { useThemedStyles } from '../../theme';
import { strings } from '../../utils/strings';
import { createStyles } from './styles';

const TransactionsIcon = assets.icons.transactions;

const formatAmount = (amount: string | number) => {
  const value = Number(amount);
  if (!Number.isFinite(value)) {
    return String(amount);
  }
  return value.toLocaleString(strings.transactions.dateLocale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDateLabel = (value: string) => {
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

const matchesSearch = (transaction: Transaction, searchValue: string) => {
  const query = searchValue.trim().toLowerCase();
  if (!query) {
    return true;
  }

  const dateLabel = formatDateLabel(transaction.date).toLowerCase();
  const description = transaction.description.toLowerCase();
  const categoryName = (transaction.category?.name ?? '').toLowerCase();
  const typeLabel = transaction.type.toLowerCase();

  return (
    dateLabel.includes(query) ||
    description.includes(query) ||
    categoryName.includes(query) ||
    typeLabel.includes(query)
  );
};

type MonthTransactionsScreenProps = {
  monthLabel: string;
  startDate: string;
  endDate: string;
  onBack: () => void;
};

const MonthTransactionsScreen = ({
  monthLabel,
  startDate,
  endDate,
  onBack,
}: MonthTransactionsScreenProps) => {
  const styles = useThemedStyles(createStyles);
  const [items, setItems] = useState<Transaction[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadMonthTransactions = async () => {
      setStatus('loading');
      try {
        const result = await transactionRepository.listByDateRange({
          startDate,
          endDate,
        });

        if (!isMounted) {
          return;
        }

        setItems(result);
        setStatus('ready');
      } catch {
        if (!isMounted) {
          return;
        }

        setStatus('failed');
      }
    };

    loadMonthTransactions();

    return () => {
      isMounted = false;
    };
  }, [endDate, startDate]);

  const filteredItems = useMemo(
    () => items.filter(item => matchesSearch(item, searchValue)),
    [items, searchValue],
  );

  const quickStats = useMemo(() => {
    const grouped = filteredItems.reduce<
      Record<string, { key: string; label: string; emoji: string; amount: number; count: number }>
    >((acc, item) => {
      if (item.type !== 'expense') {
        return acc;
      }

      const key = item.category?.id ?? item.categoryId;
      const current = acc[key] ?? {
        key,
        label: item.category?.name ?? strings.transactionsScreen.uncategorized,
        emoji: item.category?.emoji ?? '•',
        amount: 0,
        count: 0,
      };

      current.amount += Number(item.amount) || 0;
      current.count += 1;
      acc[key] = current;
      return acc;
    }, {});

    return Object.values(grouped)
      .sort((left, right) => right.amount - left.amount)
      .slice(0, 5);
  }, [filteredItems]);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.headerWrap}>
        <ScreenHeader title={monthLabel} icon={TransactionsIcon} />
      </View>

      <ScrollView
        contentContainerStyle={styles.monthDetailContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.monthDetailBack} onPress={onBack}>
          ‹ Back
        </Text>

        <CustomInput
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder={strings.transactionsScreen.monthSearchPlaceholder}
          containerStyle={styles.searchInput}
          inputStyle={styles.searchInputText}
        />

        <Text style={styles.monthDetailSectionTitle}>
          {strings.transactionsScreen.monthDetailBreakdown}
        </Text>

        {quickStats.length === 0 ? (
          <View style={styles.emptyStateCompact}>
            <Text style={styles.emptyMessage}>
              {strings.transactionsScreen.emptySearchMessage}
            </Text>
          </View>
        ) : (
          <View style={styles.monthBreakdownGrid}>
            {quickStats.map(item => (
              <View key={item.key} style={styles.monthBreakdownCard}>
                <View style={styles.monthBreakdownIconBox}>
                  <Text style={styles.monthBreakdownEmoji}>{item.emoji}</Text>
                </View>
                <View style={styles.monthBreakdownMain}>
                  <Text numberOfLines={2} style={styles.monthBreakdownTitle}>
                    {item.label}
                  </Text>
                  <Text style={styles.monthBreakdownMeta}>
                    {item.count} {strings.transactionsScreen.monthDetailCategoryTransactions}
                  </Text>
                </View>
                <Text style={styles.monthBreakdownAmount}>
                  {strings.transactions.currencySymbol}
                  {formatAmount(item.amount)}
                </Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.monthDetailSectionTitle}>
          {strings.transactionsScreen.monthDetailRecent}
        </Text>

        {status === 'loading' ? (
          <View style={styles.fullScreenLoader}>
            <ActivityIndicator size="large" color={styles.loader.color} />
          </View>
        ) : filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {searchValue
                ? strings.transactionsScreen.emptySearchTitle
                : strings.transactionsScreen.emptyTitle}
            </Text>
            <Text style={styles.emptyMessage}>
              {searchValue
                ? strings.transactionsScreen.emptySearchMessage
                : strings.transactionsScreen.emptyMessage}
            </Text>
          </View>
        ) : (
          filteredItems.map(transaction => {
            const sign = transaction.type === 'expense' ? '-' : '+';
            const amountLabel = `${sign}${strings.transactions.currencySymbol}${formatAmount(
              transaction.amount,
            )}`;

            return (
              <View key={transaction.id} style={styles.monthDetailRowWrapper}>
                <TransactionRow
                  transaction={transaction}
                  amountLabel={amountLabel}
                  amountTone={transaction.type}
                  topRightLabel={formatDateLabel(transaction.date)}
                />
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MonthTransactionsScreen;
