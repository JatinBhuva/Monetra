import { StyleSheet } from 'react-native';

import { spacing, typography, type ThemeColors } from '../../theme';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.backgroundSubtle,
    },
    content: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.s12,
      paddingBottom: spacing.s24,
    },
    segmentedControl: {
      flexDirection: 'row',
      alignSelf: 'center',
      backgroundColor: colors.surfaceMuted,
      borderRadius: 12,
      padding: spacing.s4,
      marginBottom: spacing.s24,
      width: 170,
    },
    segment: {
      flex: 1,
      minHeight: 34,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    segmentActive: {
      backgroundColor: colors.surface,
    },
    segmentText: {
      color: colors.muted,
      fontSize: typography.size.sm,
      fontWeight: typography.weight.semiBold,
    },
    segmentTextActive: {
      color: colors.success,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 42,
      lineHeight: 44,
      fontWeight: typography.weight.bold,
      marginBottom: spacing.s8,
    },
    subtitle: {
      color: colors.muted,
      fontSize: typography.size.md,
      lineHeight: 22,
      marginBottom: spacing.s20,
      maxWidth: '86%',
    },
    formSection: {
      marginBottom: spacing.s16,
    },
    label: {
      color: colors.muted,
      fontSize: typography.size.xs,
      letterSpacing: 1.1,
      fontWeight: typography.weight.bold,
      marginBottom: spacing.s8,
    },
    input: {
      minHeight: 52,
      borderRadius: 12,
      backgroundColor: colors.surfaceMuted,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.s14,
    },
    inputText: {
      color: colors.textPrimary,
      fontSize: typography.size.md,
    },
    dropdownInput: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.s8,
    },
    dropdownIcon: {
      color: colors.muted,
      fontSize: 16,
    },
    calendarIcon: {
      fontSize: 16,
      color: colors.textSecondary,
      marginRight: spacing.s4,
    },
    impactCard: {
      marginTop: spacing.s10,
      borderRadius: 20,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.s14,
      marginBottom: spacing.s20,
    },
    impactHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.s12,
    },
    impactIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.successSoft,
      marginRight: spacing.s10,
    },
    impactIcon: {
      fontSize: 16,
      color: colors.success,
      fontWeight: typography.weight.bold,
    },
    impactTitle: {
      color: colors.textPrimary,
      fontSize: typography.size.md,
      fontWeight: typography.weight.bold,
    },
    impactSubtitle: {
      color: colors.muted,
      fontSize: 10,
      letterSpacing: 0.9,
      fontWeight: typography.weight.semiBold,
    },
    impactStatsRow: {
      flexDirection: 'row',
      gap: spacing.s10,
      marginBottom: spacing.s12,
    },
    impactStatBox: {
      flex: 1,
      borderRadius: 10,
      backgroundColor: colors.surfaceMuted,
      paddingVertical: spacing.s8,
      paddingHorizontal: spacing.s8,
    },
    impactStatLabel: {
      color: colors.muted,
      fontSize: 10,
      letterSpacing: 0.7,
      fontWeight: typography.weight.bold,
      marginBottom: 2,
    },
    impactStatValue: {
      color: colors.success,
      fontSize: typography.size.lg,
      fontWeight: typography.weight.bold,
    },
    impactFootnote: {
      color: colors.muted,
      fontSize: typography.size.xs,
      lineHeight: 18,
      fontStyle: 'italic',
    },
    submitButton: {
      minHeight: 56,
      borderRadius: 12,
      shadowColor: colors.success,
      shadowOpacity: 0.16,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
      elevation: 3,
    },
    errorText: {
      marginTop: spacing.s6,
      color: colors.error,
      fontSize: typography.size.sm,
    },
    typePickerBackdrop: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'center',
      paddingHorizontal: spacing.lg,
    },
    typePickerCard: {
      borderRadius: 16,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: spacing.s8,
    },
    typePickerRow: {
      minHeight: 44,
      justifyContent: 'center',
      paddingHorizontal: spacing.s14,
    },
    typePickerRowText: {
      color: colors.textPrimary,
      fontSize: typography.size.md,
      fontWeight: typography.weight.medium,
    },
  });
