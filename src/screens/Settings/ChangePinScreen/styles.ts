import { StyleSheet } from 'react-native';

import { spacing, typography, type ThemeColors } from '../../../theme';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    backgroundGlowTop: {
      position: 'absolute',
      top: -120,
      left: -90,
      width: 260,
      height: 260,
      borderRadius: 130,
      backgroundColor: colors.accentBlueSoft,
      opacity: 0.28,
    },
    backgroundGlowBottom: {
      position: 'absolute',
      bottom: -150,
      right: -100,
      width: 280,
      height: 280,
      borderRadius: 140,
      backgroundColor: colors.successSoft,
      opacity: 0.2,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.s24,
      paddingTop: spacing.s8,
      paddingBottom: spacing.s16,
    },
    progressRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing.s10,
      marginTop: spacing.s8,
    },
    progressBar: {
      width: 34,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      opacity: 0.5,
    },
    progressBarActive: {
      backgroundColor: colors.successBright,
      opacity: 1,
    },
    title: {
      marginTop: spacing.s20,
      textAlign: 'center',
      color: colors.textPrimary,
      fontWeight: typography.weight.bold,
      fontSize: typography.size.xl,
    },
    subtitle: {
      marginTop: spacing.s12,
      textAlign: 'center',
      color: colors.muted,
      fontSize: typography.size.sm,
      lineHeight: 20,
      paddingHorizontal: spacing.s16,
    },
    dotsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing.s14,
      marginTop: spacing.s28,
      marginBottom: spacing.s20,
    },
    dot: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: colors.border,
      opacity: 0.5,
    },
    dotActive: {
      backgroundColor: colors.successBright,
      opacity: 1,
    },
    helperCard: {
      marginTop: spacing.s8,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.s14,
      paddingVertical: spacing.s12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.s12,
    },
    helperIconWrap: {
      width: 34,
      height: 34,
      borderRadius: 10,
      backgroundColor: colors.successSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    helperIcon: {
      fontSize: 16,
    },
    helperTextWrap: {
      flex: 1,
    },
    helperTitle: {
      color: colors.textPrimary,
      fontWeight: typography.weight.semiBold,
      fontSize: typography.size.sm,
    },
    helperSubtitle: {
      marginTop: spacing.s4,
      color: colors.muted,
      fontSize: typography.size.xs,
    },
    errorText: {
      marginTop: spacing.s10,
      textAlign: 'center',
      color: colors.error,
      fontSize: typography.size.sm,
    },
    keypadWrap: {
      marginTop: 'auto',
      paddingBottom: spacing.s8,
      gap: spacing.s14,
    },
    keypadRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    keyButton: {
      width: 84,
      height: 58,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    keyButtonPressed: {
      backgroundColor: colors.surfaceMuted,
    },
    keyNumber: {
      color: colors.textPrimary,
      fontSize: 34,
      lineHeight: 38,
      fontWeight: typography.weight.medium,
    },
    keyMetaSingle: {
      marginTop: 0,
      fontSize: typography.size.md,
      color: colors.muted,
    },
  });
