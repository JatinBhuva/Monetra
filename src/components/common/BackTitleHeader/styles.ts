import { StyleSheet } from 'react-native';

import { spacing, typography, type ThemeColors } from '../../../theme';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: spacing.xl,
      paddingBottom: spacing.s18,
    },
    title: {
      fontSize: typography.size.lg,
      fontWeight: typography.weight.bold,
      color: colors.textPrimary,
    },
    backButton: {
      minHeight: 36,
      minWidth: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceMuted,
      paddingHorizontal: spacing.s10,
    },
    backText: {
      color: colors.textSecondary,
      fontSize: typography.size.base,
      fontWeight: typography.weight.semiBold,
    },
  });
