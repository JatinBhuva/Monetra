import { StyleSheet } from 'react-native';

import { spacing, typography, type ThemeColors } from '../../../theme';

export const createStyles = (colors: ThemeColors) => StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: typography.size.md,
    paddingVertical: spacing.s16,
    alignItems: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s8,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonDisabled: {
    backgroundColor: colors.border,
    opacity: 0.8,
  },
  label: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semiBold,
    color: colors.primaryContrast,
  },
});
