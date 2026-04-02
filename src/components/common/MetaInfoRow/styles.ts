import { StyleSheet } from 'react-native';

import { spacing, typography, type ThemeColors } from '../../../theme';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.s8,
    },
    label: {
      color: colors.muted,
      fontSize: typography.size.sm,
    },
    value: {
      color: colors.textPrimary,
      fontSize: typography.size.sm,
      fontWeight: typography.weight.semiBold,
      textAlign: 'right',
      maxWidth: '62%',
    },
  });
