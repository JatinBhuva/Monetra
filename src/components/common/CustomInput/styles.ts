import { StyleSheet } from 'react-native';

import { colors, spacing, typography } from '../../../theme';

export const styles = StyleSheet.create({
  block: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: typography.size.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.inputFocusBackground,
  },
  leadingText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semiBold,
    color: colors.muted,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.size.base,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
});
