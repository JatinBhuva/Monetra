import { StyleSheet } from 'react-native';

import { spacing, typography, type ThemeColors } from '../../theme';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.xl,
      paddingBottom: spacing.s18,
    },
    headerTitle: {
      fontSize: typography.size.xl,
      fontWeight: typography.weight.bold,
      color: colors.textPrimary,
    },
    closeButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
    },
    closeIcon: {
      fontSize: 22,
      color: colors.textSecondary,
    },
    scrollContent: {
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.xl,
    },
    formSection: {
      marginBottom: spacing.lg,
    },
    sectionLabel: {
      color: colors.muted,
      fontSize: typography.size.sm,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginBottom: spacing.s10,
      fontWeight: typography.weight.semiBold,
    },
    input: {
      minHeight: 58,
      borderRadius: 18,
      borderWidth: 0,
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.s16,
    },
    notesInput: {
      minHeight: 104,
      alignItems: 'flex-start',
      paddingTop: spacing.s14,
    },
    inputText: {
      color: colors.textPrimary,
      fontSize: typography.size.base,
    },
    typeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.s10,
    },
    typeChip: {
      width: '48%',
      minHeight: 50,
      borderRadius: 16,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.s12,
    },
    typeChipActive: {
      backgroundColor: colors.successMuted,
      borderColor: colors.success,
    },
    typeChipText: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.medium,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    typeChipTextActive: {
      color: colors.success,
      fontWeight: typography.weight.semiBold,
    },
    hintText: {
      marginTop: spacing.s8,
      color: colors.muted,
      fontSize: typography.size.xs,
      lineHeight: 18,
    },
    infoCard: {
      marginTop: spacing.s8,
      borderRadius: 14,
      backgroundColor: colors.accentBlueSoft,
      paddingHorizontal: spacing.s12,
      paddingVertical: spacing.s10,
    },
    infoText: {
      color: colors.textSecondary,
      fontSize: typography.size.xs,
      lineHeight: 18,
    },
    errorText: {
      marginTop: spacing.s6,
      fontSize: typography.size.sm,
      color: colors.error,
    },
    footer: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xl,
    },
    submitButton: {
      minHeight: 56,
      borderRadius: 20,
    },
  });
