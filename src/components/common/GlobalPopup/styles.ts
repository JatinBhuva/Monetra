import { StyleSheet } from 'react-native';

import { spacing, typography, type ThemeColors } from '../../../theme';

export const createStyles = (colors: ThemeColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: colors.surface,
    padding: spacing.xl,
  },
  title: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: typography.size.md,
    color: colors.muted,
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.primaryContrast,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semiBold,
  },
});
