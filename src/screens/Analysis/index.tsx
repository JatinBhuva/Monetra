import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { assets } from '../../assets';
import { ScreenHeader } from '../../components';
import { useAnalysis, type AnalysisRange } from './Analysis.hook';
import { strings } from '../../utils/strings';
import { spacing, useThemedStyles } from '../../theme';
import { useTabBarSpacing } from '../../hooks/useTabBarSpacing';
import { useCurrencyPreference } from '../../hooks/useCurrencyPreference';
import type { LoggedInStackParamList } from '../../types';
import { ScreenConstants } from '../../utils/constants';
import { createStyles } from './styles';

const AnalysisIcon = assets.icons.analysis;
const CHART_BAR_SLOT = 60;
const CHART_TOOLTIP_WIDTH = 112;
const CHART_SIDE_PADDING = 10;

const formatPercent = (value: number) =>
  `${value >= 0 ? '+' : ''}${Math.round(value)}%`;

const AnalysisScreen = () => {
  const styles = useThemedStyles(createStyles);
  const { currencySymbol } = useCurrencyPreference();
  const [range, setRange] = useState<AnalysisRange>('month');
  const [selectedBarIndex, setSelectedBarIndex] = useState(0);
  const chartScrollRef = useRef<ScrollView>(null);
  const [chartViewportWidth, setChartViewportWidth] = useState(0);
  const [chartContentWidth, setChartContentWidth] = useState(0);
  const isFocused = useIsFocused();
  const navigation =
    useNavigation<NativeStackNavigationProp<LoggedInStackParamList>>();
  const { status, totalSpent, deltaPercent, activityBars, categoryBreakdown } =
    useAnalysis(range);
  const tabBarSpacing = useTabBarSpacing(spacing.lg);

  const peakAmount = useMemo(
    () => Math.max(1, ...activityBars.map(item => item.amount)),
    [activityBars],
  );
  const topCategories = useMemo(() => categoryBreakdown.slice(0, 5), [categoryBreakdown]);
  const selectedBar = activityBars[selectedBarIndex] ?? null;
  const selectedTooltipLeft = useMemo(() => {
    const rawLeft =
      selectedBarIndex * CHART_BAR_SLOT +
      CHART_SIDE_PADDING -
      CHART_TOOLTIP_WIDTH / 2 +
      20;
    const maxLeft = Math.max(
      0,
      activityBars.length * CHART_BAR_SLOT +
        CHART_SIDE_PADDING * 2 -
        CHART_TOOLTIP_WIDTH,
    );
    return Math.min(Math.max(0, rawLeft), maxLeft);
  }, [activityBars.length, selectedBarIndex]);

  useEffect(() => {
    if (activityBars.length === 0) {
      setSelectedBarIndex(0);
      return;
    }
    const now = new Date();
    setSelectedBarIndex(
      range === 'year'
        ? Math.min(now.getMonth(), activityBars.length - 1)
        : Math.min(now.getDate() - 1, activityBars.length - 1),
    );
  }, [activityBars, range]);

  const scrollToSelectedBar = useCallback(() => {
    if (activityBars.length === 0 || chartViewportWidth === 0 || chartContentWidth === 0) {
      return;
    }

    const selectedCenterX =
      CHART_SIDE_PADDING + selectedBarIndex * CHART_BAR_SLOT + CHART_BAR_SLOT / 2;
    const maxScrollX = Math.max(0, chartContentWidth - chartViewportWidth);
    const targetScrollX = Math.min(
      Math.max(0, selectedCenterX - chartViewportWidth / 2),
      maxScrollX,
    );

    chartScrollRef.current?.scrollTo({ x: targetScrollX, animated: true });
  }, [activityBars.length, chartContentWidth, chartViewportWidth, selectedBarIndex]);

  useEffect(() => {
    scrollToSelectedBar();
  }, [scrollToSelectedBar]);

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      scrollToSelectedBar();
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isFocused, scrollToSelectedBar]);

  const handleChartLayout = (event: LayoutChangeEvent) => {
    setChartViewportWidth(event.nativeEvent.layout.width);
  };

  const handleChartContentSizeChange = (width: number) => {
    setChartContentWidth(width);
  };
  const formatCurrency = (amount: number) =>
    `${currencySymbol}${amount.toLocaleString(strings.transactions.dateLocale, {
      maximumFractionDigits: 0,
    })}`;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.headerWrap}>
        <ScreenHeader
          title={strings.navigation.analysis}
          icon={AnalysisIcon}
        />
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: tabBarSpacing }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.segmentedControl}>
          {(['month', 'year'] as const).map(item => {
            const isActive = range === item;
            return (
              <Pressable
                key={item}
                onPress={() => setRange(item)}
                style={[styles.segment, isActive && styles.segmentActive]}
              >
                <Text
                  style={[styles.segmentText, isActive && styles.segmentTextActive]}
                >
                  {item === 'month'
                    ? strings.analysisScreen.month
                    : strings.analysisScreen.year}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {status === 'loading' ? (
          <View style={styles.loaderCard}>
            <ActivityIndicator size="large" color={styles.progressFill.backgroundColor} />
          </View>
        ) : status === 'failed' ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>{strings.analysisScreen.failedTitle}</Text>
            <Text style={styles.emptyMessage}>
              {strings.analysisScreen.failedMessage}
            </Text>
          </View>
        ) : status === 'empty' ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              {strings.analysisScreen.noAnalyticsTitle}
            </Text>
            <Text style={styles.emptyMessage}>
              {strings.analysisScreen.noAnalyticsMessage}
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.heroCard}>
              <Text style={styles.heroLabel}>{strings.analysisScreen.totalSpent}</Text>
              <Text style={styles.heroAmount}>{formatCurrency(totalSpent)}</Text>
              <View style={styles.heroDeltaRow}>
                <View style={styles.heroDeltaPill}>
                  <Text style={styles.heroDeltaText}>{formatPercent(deltaPercent)}</Text>
                </View>
                <Text style={styles.heroDeltaCaption}>
                  {range === 'month'
                    ? strings.analysisScreen.vsLastMonth
                    : strings.analysisScreen.vsLastYear}
                </Text>
              </View>
            </View>

            <View style={styles.analysisCard}>
              <View style={styles.analysisHeader}>
                <View>
                  <Text style={styles.analysisTitle}>
                    {strings.analysisScreen.analysisTitle}
                  </Text>
                  <Text style={styles.analysisSubtitle}>
                    {strings.analysisScreen.analysisSubtitle}
                  </Text>
                </View>
                <View style={styles.analysisAccentWrap}>
                  <View style={styles.analysisAccentShort} />
                  <View style={styles.analysisAccentMid} />
                  <View style={styles.analysisAccentTall} />
                </View>
              </View>

              <ScrollView
                ref={chartScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chartScrollContent}
                onLayout={handleChartLayout}
                onContentSizeChange={handleChartContentSizeChange}
              >
                <View style={styles.chartCanvas}>
                  {selectedBar ? (
                    <View
                      style={[
                        styles.chartTooltipBubble,
                        { left: selectedTooltipLeft, width: CHART_TOOLTIP_WIDTH },
                      ]}
                    >
                      <Text style={styles.chartTooltipBubbleAmount}>
                        {formatCurrency(selectedBar.amount)}
                      </Text>
                      <Text style={styles.chartTooltipBubbleDate}>
                        {selectedBar.fullLabel}
                      </Text>
                    </View>
                  ) : null}
                  <View style={styles.chartArea}>
                    {activityBars.map((item, index) => {
                      const isSelected = index === selectedBarIndex;
                      const hasValue = item.amount > 0;
                      const barHeight = Math.max(
                        36,
                        (item.amount / peakAmount) * 146 || 36,
                      );

                      return (
                        <Pressable
                          key={`${item.label}-${index}`}
                          onPress={() => setSelectedBarIndex(index)}
                          style={styles.chartColumn}
                        >
                          <View
                            style={[
                              styles.chartBar,
                              hasValue ? styles.chartBarFilled : null,
                              isSelected ? styles.chartBarSelected : null,
                              { height: barHeight },
                            ]}
                          />
                          <Text
                            style={[
                              styles.chartLabel,
                              isSelected ? styles.chartLabelSelected : null,
                            ]}
                          >
                            {item.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              </ScrollView>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {strings.analysisScreen.categoriesTitle}
              </Text>
              <Pressable
                onPress={() =>
                  navigation.navigate(ScreenConstants.ANALYSIS_CATEGORIES_SCREEN, {
                    items: categoryBreakdown,
                  })
                }
              >
                <Text style={styles.sectionLink}>{strings.analysisScreen.viewAll}</Text>
              </Pressable>
            </View>

            {topCategories.length === 0 ? (
              <Text style={styles.categoryEmpty}>
                {strings.analysisScreen.categoriesEmpty}
              </Text>
            ) : (
              topCategories.map(item => (
                <View key={item.key} style={styles.categoryCard}>
                  <View style={styles.categoryIconBox}>
                    <Text style={styles.categoryEmoji}>{item.emoji}</Text>
                  </View>
                  <View style={styles.categoryMain}>
                    <Text style={styles.categoryTitle}>{item.label}</Text>
                    <Text style={styles.categoryMeta}>
                      {item.count} Transactions
                    </Text>
                  </View>
                  <View style={styles.categoryRight}>
                    <Text style={styles.categoryAmount}>
                      {formatCurrency(item.amount)}
                    </Text>
                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${Math.max(16, item.progress * 100)}%` },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              ))
            )}

            <View style={styles.sectionHeaderLoose}>
              <Text style={styles.sectionTitle}>
                {strings.analysisScreen.investmentsTitle}
              </Text>
            </View>

            <View style={styles.investmentGrid}>
              <View style={styles.investmentCard}>
                <View style={styles.lockBadge}>
                  <Text style={styles.lockBadgeText}>
                    {strings.analysisScreen.investmentsLocked}
                  </Text>
                </View>
                <View style={styles.investmentIconDark}>
                  <Text style={styles.investmentIconText}>🏛️</Text>
                </View>
                <Text style={styles.investmentLabel}>
                  {strings.analysisScreen.investmentGrowthTitle}
                </Text>
                <Text style={styles.lockedHint}>
                  {strings.analysisScreen.investmentsLockedNote}
                </Text>
              </View>

              <View style={styles.investmentCard}>
                <View style={styles.lockBadge}>
                  <Text style={styles.lockBadgeText}>
                    {strings.analysisScreen.investmentsLocked}
                  </Text>
                </View>
                <View style={styles.investmentIconGreen}>
                  <Text style={styles.investmentIconText}>📈</Text>
                </View>
                <Text style={styles.investmentLabel}>
                  {strings.analysisScreen.investmentFundsTitle}
                </Text>
                <Text style={styles.lockedHint}>
                  {strings.analysisScreen.investmentsLockedNote}
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnalysisScreen;
