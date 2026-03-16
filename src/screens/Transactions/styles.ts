import { StyleSheet } from 'react-native';

import { colors, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fullScreenLoader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLoader: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  loader: {
    color: colors.primary,
  },
  listContent: {
    paddingTop: spacing.s6,
    paddingBottom: spacing.xxl,
  },
  rowWrapper: {
    marginBottom: spacing.s12,
    marginHorizontal: spacing.lg,
  },
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: spacing.s16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    marginHorizontal: spacing.lg,
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
    textAlign: 'center',
  },
  dayHeader: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semiBold,
    color: colors.muted,
    marginBottom: spacing.s8,
    marginTop: spacing.s6,
    marginHorizontal: spacing.lg,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.inputFocusBackground,
    borderRadius: spacing.s14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.s12,
    paddingHorizontal: spacing.s14,
    marginTop: spacing.s6,
    marginBottom: spacing.s12,
    marginHorizontal: spacing.lg,
  },
  monthTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semiBold,
    color: colors.textPrimary,
  },
  monthMeta: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: spacing.md,
    marginRight: spacing.s8,
  },
  monthMetaLabel: {
    fontSize: typography.size.xs,
    color: colors.muted,
    marginBottom: spacing.s4,
  },
  monthMetaAmount: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semiBold,
    color: colors.textPrimary,
  },
  monthChevron: {
    width: spacing.s28,
    height: spacing.s28,
    borderRadius: spacing.s14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthChevronIcon: {
    fontSize: typography.size.lg,
    color: colors.muted,
    marginTop: -2,
  },
});

export const getListContentStyle = (paddingBottom: number) => [
  styles.listContent,
  { paddingBottom },
];
