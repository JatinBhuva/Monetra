import { StyleSheet } from 'react-native';

import { spacing, typography, type ThemeColors } from '../../theme';

export const createStyles = (colors: ThemeColors) => StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: spacing.s16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.s12,
    paddingHorizontal: spacing.md,
  },
  rowDashboard: {
    borderWidth: 0,
    borderRadius: spacing.s22,
    paddingVertical: spacing.s16,
    paddingHorizontal: spacing.s16,
    shadowColor: colors.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 1,
  },
  rowCompact: {
    paddingVertical: spacing.s10,
    paddingHorizontal: spacing.s12,
    borderWidth: 0,
    backgroundColor: colors.surface,
  },
  iconCircle: {
    width: spacing.s40,
    height: spacing.s40,
    borderRadius: spacing.s20,
    backgroundColor: colors.categoryActiveBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconCircleDashboard: {
    width: 54,
    height: 54,
    borderRadius: spacing.s14,
    backgroundColor: colors.backgroundSubtle,
    marginRight: spacing.s14,
  },
  iconCircleCompact: {
    width: spacing.s36,
    height: spacing.s36,
    borderRadius: spacing.s18,
    marginRight: spacing.s12,
  },
  iconText: {
    fontSize: typography.size.md,
  },
  iconTextDashboard: {
    fontSize: typography.size.xl,
  },
  iconTextCompact: {
    fontSize: typography.size.sm,
  },
  rowContent: {
    flex: 1,
  },
  rowContentCentered: {
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.s4,
  },
  titleDashboard: {
    fontSize: typography.size.base,
  },
  titleCompact: {
    fontSize: typography.size.sm,
  },
  subtitle: {
    fontSize: typography.size.sm,
    color: colors.muted,
  },
  subtitleDashboard: {
    fontSize: typography.size.sm,
  },
  subtitleStandalone: {
    marginBottom: 0,
  },
  subtitleCompact: {
    fontSize: typography.size.xs,
  },
  meta: {
    alignItems: 'flex-end',
    marginLeft: spacing.s12,
  },
  metaLabel: {
    fontSize: typography.size.xs,
    color: colors.muted,
    marginBottom: spacing.s4,
  },
  metaLabelCompact: {
    marginBottom: spacing.s4,
  },
  amount: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semiBold,
  },
  amountDashboard: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
  },
  amountExpense: {
    color: colors.error,
  },
  amountIncome: {
    color: colors.success,
  },
  amountIncomeDashboard: {
    color: colors.primary,
  },
});
