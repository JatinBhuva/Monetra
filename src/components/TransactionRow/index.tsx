import React from 'react';
import { Text, View } from 'react-native';

import { useThemedStyles } from '../../theme';
import { createStyles } from './styles';
import { strings } from '../../utils/strings';
import type { Transaction } from '../../types/transactions';

type TransactionRowProps = {
  transaction: Transaction;
  amountLabel?: string;
  amountTone?: 'expense' | 'income';
  topRightLabel?: string;
  variant?: 'default' | 'compact';
};

const TransactionRow = ({
  transaction,
  amountLabel,
  amountTone,
  topRightLabel,
  variant = 'default',
}: TransactionRowProps) => {
  const styles = useThemedStyles(createStyles);
  const isCompact = variant === 'compact';
  const description = transaction.description.trim();
  const hasDescription = description.length > 0;
  const categoryName =
    transaction.category?.name ?? strings.transactionsScreen.uncategorized;
  const categoryEmoji = transaction.category?.emoji ?? '•';

  const amountStyle =
    amountTone === 'expense'
      ? styles.amountExpense
      : amountTone === 'income'
        ? styles.amountIncome
        : undefined;

  return (
    <View style={[styles.row, isCompact && styles.rowCompact]}>
      <View style={[styles.iconCircle, isCompact && styles.iconCircleCompact]}>
        <Text style={[styles.iconText, isCompact && styles.iconTextCompact]}>
          {categoryEmoji}
        </Text>
      </View>
      <View
        style={[
          styles.rowContent,
          !hasDescription && styles.rowContentCentered,
        ]}
      >
        {hasDescription ? (
          <>
            <Text
              style={[styles.title, isCompact && styles.titleCompact]}
              numberOfLines={1}
            >
              {description}
            </Text>
            <Text
              style={[styles.subtitle, isCompact && styles.subtitleCompact]}
              numberOfLines={1}
            >
              {categoryName}
            </Text>
          </>
        ) : (
          <Text
            style={[
              styles.subtitle,
              styles.subtitleStandalone,
              isCompact && styles.subtitleCompact,
            ]}
            numberOfLines={1}
          >
            {categoryName}
          </Text>
        )}
      </View>
      {(topRightLabel || amountLabel) && (
        <View style={styles.meta}>
          {topRightLabel ? (
            <Text style={[styles.metaLabel, isCompact && styles.metaLabelCompact]}>
              {topRightLabel}
            </Text>
          ) : null}
          {amountLabel ? (
            <Text style={[styles.amount, amountStyle]} numberOfLines={1}>
              {amountLabel}
            </Text>
          ) : null}
        </View>
      )}
    </View>
  );
};

export default TransactionRow;
