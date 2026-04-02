import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackTitleHeader } from '../../components';
import { useCurrencyPreference } from '../../hooks/useCurrencyPreference';
import { useThemedStyles } from '../../theme';
import { strings } from '../../utils/strings';
import {
  formatInvestmentAmount,
  formatInvestmentDate,
  useInvestmentsScreen,
} from './Investments.hook';
import { createStyles } from './styles';

type InvestmentsScreenProps = {
  onBack?: () => void;
};

const InvestmentsScreen = ({ onBack }: InvestmentsScreenProps) => {
  const styles = useThemedStyles(createStyles);
  const { currencySymbol } = useCurrencyPreference();
  const { mode, setMode, status, items, emptyMessage, openInvestmentDetail } =
    useInvestmentsScreen();

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BackTitleHeader title={strings.investments.listTitle} onBack={onBack} />

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
            <Pressable
              key={item.id}
              style={styles.investmentCard}
              onPress={() => openInvestmentDetail(item)}
            >
              <View style={styles.cardTop}>
                <Text style={styles.typeLabel}>{strings.investments.typeNames[item.type]}</Text>
                <Text style={styles.amount}>
                  {currencySymbol}
                  {formatInvestmentAmount(item.amount)}
                </Text>
              </View>
              <Text style={styles.meta}>{formatInvestmentDate(item.date)}</Text>
              {item.policyNumber ? (
                <Text style={styles.meta}>
                  {strings.investments.listPolicyNumber}: {item.policyNumber}
                </Text>
              ) : null}
              {item.policyStartDate ? (
                <Text style={styles.meta}>
                  {strings.investments.listPolicyStart}:{' '}
                  {formatInvestmentDate(item.policyStartDate)}
                </Text>
              ) : null}
              <Text style={styles.note}>
                {item.note?.trim() ? item.note : strings.investments.listNoNote}
              </Text>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default InvestmentsScreen;
