import { StyleSheet } from 'react-native';

import { colors, spacing, typography } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: spacing.md,
  },
  label: {
    fontSize: typography.size.xs,
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
  },
});
