import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackTitleHeader, MetaInfoRow } from '../../components';
import { useCurrencyPreference } from '../../hooks/useCurrencyPreference';
import { useThemedStyles } from '../../theme';
import type { Investment } from '../../types/investments';
import { strings } from '../../utils/strings';
import { createStyles } from './investmentDetail.styles';

type InvestmentDetailScreenProps = {
  investment: Investment;
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

const InvestmentDetailScreen = ({
  investment,
  onBack,
  onEdit,
  onDelete,
}: InvestmentDetailScreenProps) => {
  const styles = useThemedStyles(createStyles);
  const { currencySymbol } = useCurrencyPreference();

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <BackTitleHeader title={strings.investments.detailTitle} onBack={onBack} />

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>
            {strings.investments.detailAmountLabel}
          </Text>
          <Text style={styles.amount}>
            {currencySymbol}
            {formatAmount(investment.amount)}
          </Text>
          <Text style={styles.note}>
            {investment.note?.trim() || strings.investments.listNoNote}
          </Text>
        </View>

        <View style={styles.metaCard}>
          <MetaInfoRow
            label={strings.investments.detailTypeLabel}
            value={strings.investments.typeNames[investment.type]}
          />
          <MetaInfoRow
            label={strings.investments.detailDateLabel}
            value={formatDate(investment.date)}
          />
          <MetaInfoRow
            label={strings.investments.listPolicyNumber}
            value={investment.policyNumber?.trim() || '-'}
          />
          <MetaInfoRow
            label={strings.investments.listPolicyStart}
            value={
              investment.policyStartDate
                ? formatDate(investment.policyStartDate)
                : '-'
            }
          />
          <MetaInfoRow
            label={strings.investments.detailIdLabel}
            value={investment.id}
          />
        </View>

        <View style={styles.actionRow}>
          <Pressable style={styles.editButton} onPress={onEdit}>
            <Text style={styles.editText}>{strings.investments.editAction}</Text>
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={onDelete}>
            <Text style={styles.deleteText}>
              {strings.investments.deleteAction}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InvestmentDetailScreen;
