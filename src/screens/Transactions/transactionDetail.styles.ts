import { StyleSheet } from 'react-native';

import { spacing, typography, type ThemeColors } from '../../theme';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.xl,
    },
    summaryCard: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      padding: spacing.s14,
      marginBottom: spacing.s14,
    },
    summaryLabel: {
      color: colors.muted,
      fontSize: typography.size.xs,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: spacing.s8,
    },
    amountExpense: {
      color: colors.error,
      fontSize: typography.size.xl,
      fontWeight: typography.weight.bold,
      marginBottom: spacing.s8,
    },
    amountIncome: {
      color: colors.success,
      fontSize: typography.size.xl,
      fontWeight: typography.weight.bold,
      marginBottom: spacing.s8,
    },
    description: {
      color: colors.textPrimary,
      fontSize: typography.size.base,
      fontWeight: typography.weight.semiBold,
    },
    metaCard: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      padding: spacing.s14,
      marginBottom: spacing.s14,
    },
    actionRow: {
      flexDirection: 'row',
      gap: spacing.s10,
    },
    editButton: {
      flex: 1,
      minHeight: 48,
      borderRadius: 14,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    editText: {
      color: colors.primaryContrast,
      fontSize: typography.size.md,
      fontWeight: typography.weight.semiBold,
    },
    deleteButton: {
      flex: 1,
      minHeight: 48,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.error,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
    },
    deleteText: {
      color: colors.error,
      fontSize: typography.size.md,
      fontWeight: typography.weight.semiBold,
    },
  });
