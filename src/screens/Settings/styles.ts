import { StyleSheet } from 'react-native';

import { colors, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.s6,
    paddingBottom: spacing.xxl,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.s8,
  },
  sectionDescription: {
    fontSize: typography.size.sm,
    color: colors.muted,
    marginBottom: spacing.lg,
  },
  row: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: spacing.s8,
  },
  rowFirst: {
    borderTopWidth: 0,
    paddingTop: 0,
  },
  rowPressed: {
    opacity: 0.7,
  },
  rowDisabled: {
    opacity: 0.5,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowIcon: {
    fontSize: typography.size.base,
    marginRight: spacing.sm,
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semiBold,
    color: colors.textPrimary,
  },
  rowDescription: {
    marginTop: spacing.s4,
    fontSize: typography.size.xs,
    color: colors.muted,
  },
  rowValue: {
    fontSize: typography.size.sm,
    color: colors.muted,
    textAlign: 'right',
    marginLeft: spacing.md,
  },
});

export const getContentStyle = (paddingBottom: number) => [
  styles.content,
  { paddingBottom },
];
