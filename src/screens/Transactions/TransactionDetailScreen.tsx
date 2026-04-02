import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackTitleHeader, MetaInfoRow } from '../../components';
import { useCurrencyPreference } from '../../hooks/useCurrencyPreference';
import { useThemedStyles } from '../../theme';
import type { Transaction } from '../../types/transactions';
import { strings } from '../../utils/strings';
import { createStyles } from './transactionDetail.styles';

type TransactionDetailScreenProps = {
  transaction: Transaction;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const formatDate = (value: string) => {
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

const formatAmount = (value: string) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return value;
  }
  return amount.toLocaleString(strings.transactions.dateLocale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const TransactionDetailScreen = ({
  transaction,
  onBack,
  onEdit,
  onDelete,
}: TransactionDetailScreenProps) => {
  const styles = useThemedStyles(createStyles);
  const { currencySymbol } = useCurrencyPreference();
  const categoryName =
    transaction.category?.name ?? strings.transactionsScreen.uncategorized;
  const title =
    transaction.description.trim() ||
    strings.dashboardScreen.untitledTransaction;
  const amountLabel = `${transaction.type === 'expense' ? '-' : '+'}${
    currencySymbol
  }${formatAmount(transaction.amount)}`;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <BackTitleHeader title={strings.transactionsScreen.detailTitle} onBack={onBack} />

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>
            {strings.transactionsScreen.detailAmountLabel}
          </Text>
          <Text
            style={
              transaction.type === 'expense'
                ? styles.amountExpense
                : styles.amountIncome
            }
          >
            {amountLabel}
          </Text>
          <Text style={styles.description}>{title}</Text>
        </View>

        <View style={styles.metaCard}>
          <MetaInfoRow
            label={strings.transactionsScreen.detailTypeLabel}
            value={
              transaction.type === 'expense'
                ? strings.transactions.expense
                : strings.transactions.income
            }
          />
          <MetaInfoRow
            label={strings.transactionsScreen.detailCategoryLabel}
            value={`${transaction.category?.emoji ?? '•'} ${categoryName}`}
          />
          <MetaInfoRow
            label={strings.transactionsScreen.detailDateLabel}
            value={formatDate(transaction.date)}
          />
          <MetaInfoRow
            label={strings.transactionsScreen.detailIdLabel}
            value={transaction.id}
          />
        </View>

        <View style={styles.actionRow}>
          <Pressable style={styles.editButton} onPress={onEdit}>
            <Text style={styles.editText}>
              {strings.transactionsScreen.editAction}
            </Text>
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={onDelete}>
            <Text style={styles.deleteText}>
              {strings.transactionsScreen.deleteAction}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TransactionDetailScreen;
