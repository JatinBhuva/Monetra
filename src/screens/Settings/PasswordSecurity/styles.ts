import { StyleSheet } from 'react-native';

import { spacing, typography, type ThemeColors } from '../../../theme';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerWrap: {
      paddingHorizontal: spacing.s24,
    },
    content: {
      paddingHorizontal: spacing.s24,
      paddingBottom: spacing.xxl,
      gap: spacing.s16,
    },
    sectionCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.s16,
      gap: spacing.s12,
    },
    sectionTitle: {
      fontSize: typography.size.md,
      fontWeight: typography.weight.bold,
      color: colors.textPrimary,
    },
    sectionDescription: {
      fontSize: typography.size.sm,
      color: colors.muted,
      lineHeight: 20,
    },
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    toggleLabel: {
      flex: 1,
      fontSize: typography.size.md,
      fontWeight: typography.weight.medium,
      color: colors.textPrimary,
      marginRight: spacing.s12,
    },
    toggleValue: {
      fontSize: typography.size.sm,
      color: colors.muted,
      marginRight: spacing.s10,
    },
    errorText: {
      fontSize: typography.size.sm,
      color: colors.error,
    },
    button: {
      marginTop: spacing.s8,
    },
  });
