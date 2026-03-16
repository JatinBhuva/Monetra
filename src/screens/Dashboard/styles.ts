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

export const getContentStyle = (paddingBottom: number) => [
  styles.content,
  { paddingBottom },
];
