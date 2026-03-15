import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';

import { useAnalysis, type AnalysisRange } from './Analysis.hook';
import { styles } from './styles';
import { colors, spacing } from '../../theme';
import { TabHeader, LineAreaChart, DonutChart, BarChart } from '../../components';
import { strings } from '../../utils/strings';
import { useTabBarSpacing } from '../../hooks/useTabBarSpacing';

const formatCurrency = (amount: number) =>
  `${strings.transactions.currencySymbol}${amount.toLocaleString(
    strings.transactions.dateLocale,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  )}`;

const formatPercent = (value: number) =>
  `${Math.round(value)}%`;

const AnalysisLoader = () => (
  <View style={styles.loaderCard}>
    <View style={styles.loaderHeader}>
      <View style={styles.loaderDot} />
      <View style={styles.loaderTextGroup}>
        <View style={styles.loaderLineLg} />
        <View style={styles.loaderLineSm} />
      </View>
    </View>
    <View style={styles.loaderChart}>
      <View style={styles.loaderBar} />
      <View style={[styles.loaderBar, styles.loaderBarMid]} />
      <View style={[styles.loaderBar, styles.loaderBarShort]} />
    </View>
    <Text style={styles.loaderLabel}>Preparing your insights...</Text>
  </View>
);

const AnalysisScreen = () => {
  const [range, setRange] = useState<AnalysisRange>('week');
  const {
    status,
    summary,
    lineSeries,
    categoryMix,
    weeklyCashflow,
    averages,
    insight,
  } = useAnalysis(range);
  const { width } = useWindowDimensions();

  const chartWidth = Math.min(340, width - spacing.lg * 2 - spacing.md * 2);
  const tabBarSpacing = useTabBarSpacing(spacing.lg);
  const savingsStyle =
    summary.savingsRate >= 0 ? styles.summaryDelta : styles.summaryDeltaNegative;

  return (
    <View style={styles.container}>
      <TabHeader title="Analytics" subtitle="Your spending rhythm at a glance." />
      <View style={styles.segmentedControl}>
        {(['week', 'month', 'year'] as const).map(item => {
          const isActive = range === item;
          const label = item === 'month' ? 'Month' : item === 'week' ? 'Week' : 'Year';
          return (
            <Pressable
              key={item}
              onPress={() => setRange(item)}
              style={[styles.segment, isActive && styles.segmentActive]}
            >
              <Text
                style={[styles.segmentText, isActive && styles.segmentTextActive]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {status === 'loading' ? (
        <View style={styles.loaderWrapper}>
          <AnalysisLoader />
        </View>
      ) : status === 'failed' ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Unable to load analytics</Text>
          <Text style={styles.emptyMessage}>Please try again in a moment.</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: tabBarSpacing }]}
        >

          {status === 'empty' ? (
            <View style={styles.emptyInline}>
              <Text style={styles.emptyTitle}>No analytics yet</Text>
              <Text style={styles.emptyMessage}>
                Add transactions to unlock charts and insights.
              </Text>
            </View>
          ) : null}

          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total spend ({summary.rangeLabel})</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(summary.monthExpenseTotal)}
              </Text>
              <Text style={savingsStyle}>
                {formatPercent(summary.savingsRate)} savings rate
              </Text>
            </View>
            <View style={[styles.summaryCard, styles.summaryCardLast]}>
              <Text style={styles.summaryLabel}>Total income</Text>
              <Text style={styles.summaryValue}>****</Text>
              <Text style={styles.summaryMeta}>{' '}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>Spending Pulse</Text>
                <Text style={styles.cardSubtitle}>
                  {range === 'week'
                    ? 'Last 7 days'
                    : range === 'year'
                      ? 'Last 12 months'
                      : 'Last 30 days'}
                </Text>
              </View>
              <View style={styles.pill}>
                <Text style={styles.pillText}>
                  {range === 'week'
                    ? 'This week'
                    : range === 'year'
                      ? 'This year'
                      : summary.rangeLabel}
                </Text>
              </View>
            </View>
            <LineAreaChart values={lineSeries.values} width={chartWidth} height={120} />
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardFooterLabel}>Avg spend</Text>
                <Text style={styles.cardFooterValue}>
                  {formatCurrency(lineSeries.average)} / day
                </Text>
              </View>
              <View>
                <Text style={styles.cardFooterLabel}>Peak day</Text>
                <Text style={styles.cardFooterValue}>{lineSeries.peakLabel}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>Category Mix</Text>
                <Text style={styles.cardSubtitle}>Where money flows</Text>
              </View>
              <View style={[styles.pill, styles.pillAlt]}>
                <Text style={styles.pillText}>
                  {range === 'week'
                    ? 'Last 7 days'
                    : range === 'year'
                      ? 'Last 12 months'
                      : 'Last 30 days'}
                </Text>
              </View>
            </View>
            {categoryMix.length === 0 ? (
              <Text style={styles.emptyMessage}>No expense data yet.</Text>
            ) : (
              <View style={styles.donutRow}>
                <View style={styles.donutGraphic}>
                  <DonutChart
                    segments={categoryMix}
                    size={180}
                    innerRadius={46}
                    outerRadius={72}
                    centerFill={colors.surface}
                  />
                </View>
                <View style={styles.legend}>
                  {categoryMix.map(segment => (
                    <View style={styles.legendRow} key={segment.label}>
                      <View
                        style={[styles.legendDot, { backgroundColor: segment.color }]}
                      />
                      <Text style={styles.legendLabel}>{segment.label}</Text>
                      <Text style={styles.legendValue}>{segment.value}%</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>Cashflow Trend</Text>
                <Text style={styles.cardSubtitle}>Income vs expense</Text>
              </View>
              <View style={[styles.pill, styles.pillSoft]}>
                <Text style={styles.pillText}>
                  {range === 'week'
                    ? '7 days'
                    : range === 'year'
                      ? '12 months'
                      : '5 weeks'}
                </Text>
              </View>
            </View>
            <BarChart data={weeklyCashflow} width={chartWidth} height={110} />
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardFooterLabel}>Avg income</Text>
                <Text style={styles.cardFooterValue}>
                  {formatCurrency(averages.income)}
                </Text>
              </View>
              <View>
                <Text style={styles.cardFooterLabel}>Avg expense</Text>
                <Text style={styles.cardFooterValue}>
                  {formatCurrency(averages.expense)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>{insight.title}</Text>
            <Text style={styles.insightBody}>{insight.body}</Text>
            <View style={styles.insightChips}>
              {insight.chips.map((label, index) => (
                <View
                  key={label}
                  style={[styles.insightChip, index === 0 && styles.insightChipSpacer]}
                >
                  <Text style={styles.insightChipText}>{label}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default AnalysisScreen;
