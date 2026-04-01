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
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: spacing.xl,
      paddingBottom: spacing.s18,
    },
    title: {
      fontSize: typography.size.xl,
      fontWeight: typography.weight.bold,
      color: colors.textPrimary,
    },
    backButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
    },
    backIcon: {
      fontSize: 22,
      color: colors.textSecondary,
    },
    segmentedControl: {
      flexDirection: 'row',
      backgroundColor: colors.surfaceMuted,
      borderRadius: 16,
      padding: spacing.s4,
      marginBottom: spacing.lg,
    },
    segment: {
      flex: 1,
      minHeight: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    segmentActive: {
      backgroundColor: colors.surface,
    },
    segmentText: {
      color: colors.muted,
      fontSize: typography.size.sm,
      fontWeight: typography.weight.medium,
    },
    segmentTextActive: {
      color: colors.textPrimary,
      fontWeight: typography.weight.semiBold,
    },
    loaderWrap: {
      paddingVertical: spacing.xxl,
      alignItems: 'center',
    },
    emptyWrap: {
      paddingVertical: spacing.xxl,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: typography.size.base,
      color: colors.muted,
      textAlign: 'center',
    },
    investmentCard: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: spacing.s14,
      marginBottom: spacing.s12,
      borderWidth: 1,
      borderColor: colors.borderStrong,
    },
    cardTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.s8,
    },
    typeLabel: {
      color: colors.textSecondary,
      fontSize: typography.size.sm,
      fontWeight: typography.weight.semiBold,
    },
    amount: {
      color: colors.success,
      fontSize: typography.size.lg,
      fontWeight: typography.weight.bold,
    },
    meta: {
      color: colors.muted,
      fontSize: typography.size.sm,
      marginBottom: spacing.s6,
    },
    note: {
      color: colors.textSecondary,
      fontSize: typography.size.sm,
      lineHeight: 20,
    },
  });
