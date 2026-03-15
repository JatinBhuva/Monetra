import { StyleSheet } from 'react-native';

import { colors, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.s12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
  },
  textBlock: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.s6,
  },
  subtitle: {
    fontSize: typography.size.sm,
    color: colors.muted,
  },
  rightAccessory: {
    paddingTop: spacing.s6,
  },
});
