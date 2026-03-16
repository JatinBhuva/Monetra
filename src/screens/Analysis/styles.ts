import { StyleSheet } from 'react-native';

import { colors, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.s6,
    paddingBottom: spacing.xxl,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: spacing.s20,
    padding: spacing.s6,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.s6,
    alignItems: 'center',
    borderRadius: spacing.s16,
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  segmentText: {
    fontSize: typography.size.sm,
    color: colors.muted,
    fontWeight: typography.weight.medium,
  },
  segmentTextActive: {
    color: colors.surface,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: spacing.s16,
    padding: spacing.md,
    marginRight: spacing.md,
    shadowColor: colors.primary,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 3,
  },
  summaryCardLast: {
    marginRight: 0,
  },
  summaryLabel: {
    fontSize: typography.size.xs,
    color: colors.muted,
    marginBottom: spacing.s6,
  },
  summaryValue: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.s6,
  },
  summaryDelta: {
    fontSize: typography.size.xs,
    color: colors.success,
  },
  summaryDeltaNegative: {
    fontSize: typography.size.xs,
    color: colors.error,
  },
  summaryMeta: {
    fontSize: typography.size.xs,
    color: colors.muted,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.s20,
    padding: spacing.md,
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.s4,
  },
  cardSubtitle: {
    fontSize: typography.size.xs,
    color: colors.muted,
  },
  pill: {
    backgroundColor: '#E9EDFF',
    paddingHorizontal: spacing.s12,
    paddingVertical: spacing.s6,
    borderRadius: spacing.s16,
  },
  pillAlt: {
    backgroundColor: '#FFF3E0',
  },
  pillSoft: {
    backgroundColor: '#E6F5EA',
  },
  pillText: {
    fontSize: typography.size.xs,
    color: colors.primary,
    fontWeight: typography.weight.semiBold,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  cardFooterLabel: {
    fontSize: typography.size.xs,
    color: colors.muted,
    marginBottom: spacing.s4,
  },
  cardFooterValue: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semiBold,
    color: colors.textPrimary,
  },
  donutRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  donutGraphic: {
    marginRight: spacing.md,
  },
  legend: {
    flex: 1,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.s10,
  },
  legendDot: {
    width: spacing.s10,
    height: spacing.s10,
    borderRadius: spacing.s10,
    marginRight: spacing.s8,
  },
  legendLabel: {
    flex: 1,
    fontSize: typography.size.sm,
    color: colors.textPrimary,
  },
  legendValue: {
    fontSize: typography.size.sm,
    color: colors.muted,
  },
  insightCard: {
    backgroundColor: colors.primary,
    borderRadius: spacing.s20,
    padding: spacing.lg,
    shadowColor: colors.primary,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 4,
  },
  insightTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semiBold,
    color: colors.surface,
    marginBottom: spacing.s8,
  },
  insightBody: {
    fontSize: typography.size.sm,
    color: colors.surface,
    opacity: 0.9,
    marginBottom: spacing.md,
  },
  insightChips: {
    flexDirection: 'row',
  },
  insightChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.s12,
    paddingVertical: spacing.s6,
    borderRadius: spacing.s16,
  },
  insightChipSpacer: {
    marginRight: spacing.s8,
  },
  insightChipText: {
    fontSize: typography.size.xs,
    color: colors.surface,
  },
  loaderWrapper: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  loaderCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.s20,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loaderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  loaderDot: {
    width: spacing.s12,
    height: spacing.s12,
    borderRadius: spacing.s12,
    backgroundColor: colors.categoryActiveBackground,
    marginRight: spacing.s12,
  },
  loaderTextGroup: {
    flex: 1,
  },
  loaderLineLg: {
    height: spacing.s12,
    borderRadius: spacing.s6,
    backgroundColor: colors.categoryActiveBackground,
    marginBottom: spacing.s8,
    width: '70%',
  },
  loaderLineSm: {
    height: spacing.s10,
    borderRadius: spacing.s6,
    backgroundColor: colors.inputFocusBackground,
    width: '45%',
  },
  loaderChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
    height: spacing.s40,
  },
  loaderBar: {
    width: spacing.s12,
    height: spacing.s32,
    borderRadius: spacing.s6,
    backgroundColor: colors.inputFocusBackground,
    marginRight: spacing.s8,
  },
  loaderBarMid: {
    height: spacing.s24,
  },
  loaderBarShort: {
    height: spacing.s18,
  },
  loaderLabel: {
    fontSize: typography.size.sm,
    color: colors.muted,
  },
  emptyState: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  emptyInline: {
    backgroundColor: colors.surface,
    borderRadius: spacing.s16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.s6,
  },
  emptyMessage: {
    fontSize: typography.size.sm,
    color: colors.muted,
  },
});

export const getContentStyle = (paddingBottom: number) => [
  styles.content,
  { paddingBottom },
];

export const getLegendDotStyle = (color: string) => [
  styles.legendDot,
  { backgroundColor: color },
];
