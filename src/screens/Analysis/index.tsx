import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';

import { useAnalysis, type AnalysisRange } from './Analysis.hook';
import { getContentStyle, getLegendDotStyle, styles } from './styles';
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
    <Text style={styles.loaderLabel}>{strings.analysis.loaderLabel}</Text>
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
  const rangeLabels: Record<AnalysisRange, string> = {
    week: strings.analysis.tabWeek,
    month: strings.analysis.tabMonth,
    year: strings.analysis.tabYear,
  };
  const rangeLastLabel =
    range === 'week'
      ? strings.analysis.rangeLast7Days
      : range === 'year'
        ? strings.analysis.rangeLast12Months
        : strings.analysis.rangeLast30Days;
  const rangeThisLabel =
    range === 'week'
      ? strings.analysis.rangeThisWeek
      : range === 'year'
        ? strings.analysis.rangeThisYear
        : summary.rangeLabel;
  const cashflowRangeLabel =
    range === 'week'
      ? strings.analysis.cashflowRangeWeek
      : range === 'year'
        ? strings.analysis.cashflowRangeYear
        : strings.analysis.cashflowRangeMonth;

  return (
    <View style={styles.container}>
      <TabHeader title={strings.analysis.title} subtitle={strings.analysis.subtitle} />
      <View style={styles.segmentedControl}>
        {(['week', 'month', 'year'] as const).map(item => {
          const isActive = range === item;
          const label = rangeLabels[item];
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
          <Text style={styles.emptyTitle}>{strings.analysis.failedTitle}</Text>
          <Text style={styles.emptyMessage}>{strings.analysis.failedMessage}</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={getContentStyle(tabBarSpacing)}
        >

          {status === 'empty' ? (
            <View style={styles.emptyInline}>
              <Text style={styles.emptyTitle}>{strings.analysis.emptyTitle}</Text>
              <Text style={styles.emptyMessage}>{strings.analysis.emptyMessage}</Text>
            </View>
          ) : null}

          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>
                {strings.analysis.summaryTotalSpendLabel} ({summary.rangeLabel})
              </Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(summary.monthExpenseTotal)}
              </Text>
              <Text style={savingsStyle}>
                {formatPercent(summary.savingsRate)} {strings.analysis.summarySavingsRateSuffix}
              </Text>
            </View>
            <View style={[styles.summaryCard, styles.summaryCardLast]}>
              <Text style={styles.summaryLabel}>
                {strings.analysis.summaryTotalIncomeLabel}
              </Text>
              <Text style={styles.summaryValue}>{strings.analysis.incomeMaskedValue}</Text>
              <Text style={styles.summaryMeta}>{' '}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>{strings.analysis.spendingPulseTitle}</Text>
                <Text style={styles.cardSubtitle}>{rangeLastLabel}</Text>
              </View>
              <View style={styles.pill}>
                <Text style={styles.pillText}>{rangeThisLabel}</Text>
              </View>
            </View>
            <LineAreaChart values={lineSeries.values} width={chartWidth} height={120} />
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardFooterLabel}>{strings.analysis.avgSpendLabel}</Text>
                <Text style={styles.cardFooterValue}>
                  {formatCurrency(lineSeries.average)} {strings.analysis.perDaySuffix}
                </Text>
              </View>
              <View>
                <Text style={styles.cardFooterLabel}>{strings.analysis.peakDayLabel}</Text>
                <Text style={styles.cardFooterValue}>{lineSeries.peakLabel}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>{strings.analysis.categoryMixTitle}</Text>
                <Text style={styles.cardSubtitle}>{strings.analysis.categoryMixSubtitle}</Text>
              </View>
              <View style={[styles.pill, styles.pillAlt]}>
                <Text style={styles.pillText}>{rangeLastLabel}</Text>
              </View>
            </View>
            {categoryMix.length === 0 ? (
              <Text style={styles.emptyMessage}>{strings.analysis.noExpenseData}</Text>
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
                        style={getLegendDotStyle(segment.color)}
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
                <Text style={styles.cardTitle}>{strings.analysis.cashflowTitle}</Text>
                <Text style={styles.cardSubtitle}>{strings.analysis.cashflowSubtitle}</Text>
              </View>
              <View style={[styles.pill, styles.pillSoft]}>
                <Text style={styles.pillText}>{cashflowRangeLabel}</Text>
              </View>
            </View>
            <BarChart data={weeklyCashflow} width={chartWidth} height={110} />
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardFooterLabel}>{strings.analysis.avgIncomeLabel}</Text>
                <Text style={styles.cardFooterValue}>
                  {formatCurrency(averages.income)}
                </Text>
              </View>
              <View>
                <Text style={styles.cardFooterLabel}>{strings.analysis.avgExpenseLabel}</Text>
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
