import { StyleSheet } from 'react-native';

import { spacing, typography, type ThemeColors } from '../../theme';

export const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.s18,
    paddingBottom: spacing.s32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.s20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.s12,
  },
  backButtonPressed: {
    opacity: 0.8,
  },
  backIcon: {
    fontSize: 24,
    lineHeight: 24,
    color: colors.textPrimary,
    marginTop: -2,
  },
  headerTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceMuted,
    borderRadius: 20,
    padding: spacing.s4,
    marginBottom: spacing.s20,
  },
  segment: {
    flex: 1,
    minHeight: 40,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: colors.surfaceStrong,
  },
  segmentText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semiBold,
    color: colors.muted,
  },
  segmentTextActive: {
    color: colors.textInverse,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.s16,
    marginBottom: spacing.s24,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.s12,
  },
  formTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  cancelEditText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semiBold,
    color: colors.success,
  },
  formTypeRow: {
    flexDirection: 'row',
    marginBottom: spacing.s12,
    gap: spacing.s10,
  },
  formTypeChip: {
    flex: 1,
    minHeight: 38,
    borderRadius: 16,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formTypeChipActive: {
    backgroundColor: colors.successMuted,
  },
  formTypeChipText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semiBold,
    color: colors.muted,
  },
  formTypeChipTextActive: {
    color: colors.success,
  },
  inputContainer: {
    minHeight: 54,
    borderWidth: 0,
    borderRadius: 18,
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.s16,
  },
  input: {
    fontSize: typography.size.md,
    color: colors.textPrimary,
  },
  saveButton: {
    marginTop: spacing.s8,
  },
  listSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.s12,
  },
  listSectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  loaderCard: {
    minHeight: 180,
    backgroundColor: colors.surface,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: spacing.s20,
  },
  emptyTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.s8,
  },
  emptyMessage: {
    fontSize: typography.size.sm,
    color: colors.muted,
    lineHeight: 22,
  },
  categoryCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    paddingHorizontal: spacing.s16,
    paddingVertical: spacing.s16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.s14,
  },
  categoryIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.s14,
  },
  categoryEmoji: {
    fontSize: 22,
  },
  categoryMain: {
    flex: 1,
    paddingRight: spacing.s12,
  },
  categoryTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.s4,
  },
  categoryMeta: {
    fontSize: typography.size.sm,
    color: colors.muted,
  },
  categoryActions: {
    alignItems: 'flex-end',
    gap: spacing.s8,
  },
  actionChip: {
    minWidth: 72,
    borderRadius: 14,
    backgroundColor: colors.accentBlueSoft,
    paddingHorizontal: spacing.s12,
    paddingVertical: spacing.s8,
    alignItems: 'center',
  },
  actionChipPressed: {
    opacity: 0.8,
  },
  actionChipText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semiBold,
    color: colors.textPrimary,
  },
  deleteChip: {
    minWidth: 72,
    borderRadius: 14,
    backgroundColor: colors.errorSoft,
    paddingHorizontal: spacing.s12,
    paddingVertical: spacing.s8,
    alignItems: 'center',
  },
  deleteChipText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semiBold,
    color: colors.error,
  },
});
