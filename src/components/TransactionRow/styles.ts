import { StyleSheet } from 'react-native';

import { colors, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
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
  iconCircleCompact: {
    width: spacing.s36,
    height: spacing.s36,
    borderRadius: spacing.s18,
    marginRight: spacing.s12,
  },
  iconText: {
    fontSize: typography.size.md,
  },
  iconTextCompact: {
    fontSize: typography.size.sm,
  },
  rowContent: {
    flex: 1,
  },
  title: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.s4,
  },
  titleCompact: {
    fontSize: typography.size.sm,
  },
  subtitle: {
    fontSize: typography.size.sm,
    color: colors.muted,
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
  amountExpense: {
    color: colors.error,
  },
  amountIncome: {
    color: colors.success,
  },
});
