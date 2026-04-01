import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { investmentRepository } from '../../data/repositories/investmentRepository';
import { useThemedStyles } from '../../theme';
import type { Investment } from '../../types/investments';
import { strings } from '../../utils/strings';
import { createStyles } from './styles';

type InvestmentsScreenProps = {
  onBack?: () => void;
};

type InvestmentMode = 'month' | 'all';

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

const formatAmount = (amount: string) => {
  const value = Number(amount);
  if (!Number.isFinite(value)) {
    return amount;
  }
  return value.toLocaleString(strings.transactions.dateLocale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const InvestmentsScreen = ({ onBack }: InvestmentsScreenProps) => {
  const styles = useThemedStyles(createStyles);
  const [mode, setMode] = useState<InvestmentMode>('month');
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [items, setItems] = useState<Investment[]>([]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setStatus('loading');
      try {
        let nextItems: Investment[] = [];
        if (mode === 'month') {
          const now = new Date();
          const start = new Date(now.getFullYear(), now.getMonth(), 1);
          const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          nextItems = await investmentRepository.listByDateRange({
            startDate: start.toISOString(),
            endDate: end.toISOString(),
          });
        } else {
          nextItems = await investmentRepository.listAll();
        }

        if (!isMounted) {
          return;
        }
        setItems(nextItems);
        setStatus('ready');
      } catch {
        if (!isMounted) {
          return;
        }
        setItems([]);
        setStatus('failed');
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [mode]);

  const emptyMessage = useMemo(
    () =>
      mode === 'month'
        ? strings.investments.listEmptyThisMonth
        : strings.investments.listEmptyAll,
    [mode],
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>
          <Text style={styles.title}>{strings.investments.listTitle}</Text>
          <View style={styles.backButton} />
        </View>

        <View style={styles.segmentedControl}>
          <Pressable
            style={[styles.segment, mode === 'month' && styles.segmentActive]}
            onPress={() => setMode('month')}
          >
            <Text style={[styles.segmentText, mode === 'month' && styles.segmentTextActive]}>
              {strings.investments.listThisMonth}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.segment, mode === 'all' && styles.segmentActive]}
            onPress={() => setMode('all')}
          >
            <Text style={[styles.segmentText, mode === 'all' && styles.segmentTextActive]}>
              {strings.investments.listAll}
            </Text>
          </Pressable>
        </View>

        {status === 'loading' ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color={styles.amount.color} />
          </View>
        ) : status === 'failed' ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>{strings.analysisScreen.failedMessage}</Text>
          </View>
        ) : items.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>{emptyMessage}</Text>
          </View>
        ) : (
          items.map(item => (
            <View key={item.id} style={styles.investmentCard}>
              <View style={styles.cardTop}>
                <Text style={styles.typeLabel}>{strings.investments.typeNames[item.type]}</Text>
                <Text style={styles.amount}>
                  {strings.transactions.currencySymbol}
                  {formatAmount(item.amount)}
                </Text>
              </View>
              <Text style={styles.meta}>{formatDate(item.date)}</Text>
              {item.policyNumber ? (
                <Text style={styles.meta}>
                  {strings.investments.listPolicyNumber}: {item.policyNumber}
                </Text>
              ) : null}
              {item.policyStartDate ? (
                <Text style={styles.meta}>
                  {strings.investments.listPolicyStart}: {formatDate(item.policyStartDate)}
                </Text>
              ) : null}
              <Text style={styles.note}>
                {item.note?.trim() ? item.note : strings.investments.listNoNote}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default InvestmentsScreen;
