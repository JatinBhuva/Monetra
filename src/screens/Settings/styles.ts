import { StyleSheet } from 'react-native';

import { spacing, typography, type ThemeColors } from '../../theme';

export const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerWrap: {
    paddingHorizontal: spacing.s24,
    paddingTop: spacing.s12,
  },
  content: {
    paddingHorizontal: spacing.s24,
    paddingBottom: spacing.xxl,
  },
  profileCard: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.s4,
    paddingBottom: spacing.s12,
    marginBottom: spacing.s12,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.surfaceStrongAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.s12,
  },
  avatarIcon: {
    fontSize: 38,
  },
  profileEmail: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    color: colors.muted,
    textAlign: 'center',
  },
  sectionBlock: {
    marginBottom: spacing.s22,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.s12,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    paddingHorizontal: spacing.s16,
    paddingVertical: spacing.s6,
  },
  row: {
    paddingVertical: spacing.s12,
  },
  rowPressed: {
    opacity: 0.8,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rowIcon: {
    fontSize: 18,
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semiBold,
    color: colors.textPrimary,
  },
  rowDescription: {
    marginTop: spacing.s4,
    fontSize: typography.size.sm,
    color: colors.muted,
  },
  rowValue: {
    fontSize: typography.size.md,
    color: colors.muted,
    textAlign: 'right',
    marginLeft: spacing.md,
  },
  rowChevron: {
    fontSize: 22,
    lineHeight: 22,
    color: colors.muted,
    marginLeft: spacing.sm,
  },
  logoutButton: {
    marginTop: spacing.s8,
    backgroundColor: colors.warningSoft,
    borderRadius: 18,
    paddingVertical: spacing.s14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutPressed: {
    opacity: 0.85,
  },
  logoutDisabled: {
    opacity: 0.6,
  },
  logoutText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semiBold,
    color: colors.error,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    paddingHorizontal: spacing.s24,
  },
  modalCard: {
    maxHeight: '70%',
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.s14,
    paddingHorizontal: spacing.s14,
  },
  modalTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.s12,
  },
  modalList: {
    maxHeight: 420,
  },
  modalRow: {
    minHeight: 48,
    borderRadius: 12,
    paddingHorizontal: spacing.s12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalRowSelected: {
    backgroundColor: colors.successMuted,
  },
  modalRowLabel: {
    color: colors.textPrimary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    flex: 1,
    paddingRight: spacing.s8,
  },
  modalRowValue: {
    color: colors.muted,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semiBold,
  },
});
