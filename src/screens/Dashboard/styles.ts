import { StyleSheet } from 'react-native';

import { colors, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.s6,
  },
  subtitle: {
    fontSize: typography.size.sm,
    color: colors.muted,
  },
  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: spacing.s20,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 6,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.s12,
  },
  heroLabel: {
    fontSize: typography.size.sm,
    color: colors.surface,
    opacity: 0.7,
  },
  heroMonth: {
    fontSize: typography.size.sm,
    color: colors.surface,
    fontWeight: typography.weight.medium,
  },
  heroAmount: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.surface,
    marginBottom: spacing.s4,
  },
  heroSubLabel: {
    fontSize: typography.size.sm,
    color: colors.surface,
    opacity: 0.7,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semiBold,
    color: colors.textPrimary,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: spacing.s16,
    paddingVertical: spacing.s12,
    paddingHorizontal: spacing.md,
  },
  recentIcon: {
    width: spacing.s40,
    height: spacing.s40,
    borderRadius: spacing.s20,
    backgroundColor: colors.categoryActiveBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  recentIconText: {
    fontSize: typography.size.md,
  },
  recentContent: {
    flex: 1,
  },
  recentTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.s4,
  },
  recentSubtitle: {
    fontSize: typography.size.sm,
    color: colors.muted,
  },
  recentMeta: {
    alignItems: 'flex-end',
  },
  recentDate: {
    fontSize: typography.size.xs,
    color: colors.muted,
    marginBottom: spacing.s4,
  },
  recentAmount: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semiBold,
  },
  amountExpense: {
    color: colors.error,
  },
  amountIncome: {
    color: colors.success,
  },
  recentSeparator: {
    height: spacing.s10,
  },
  emptyRecent: {
    fontSize: typography.size.sm,
    color: colors.muted,
  },
  fullScreenLoader: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  loader: {
    color: colors.surface,
  },
});
