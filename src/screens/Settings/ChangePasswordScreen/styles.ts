import { StyleSheet } from 'react-native';

import { spacing, typography, type ThemeColors } from '../../../theme';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    glowTop: {
      position: 'absolute',
      top: -140,
      left: -100,
      width: 300,
      height: 300,
      borderRadius: 150,
      backgroundColor: colors.accentBlueSoft,
      opacity: 0.3,
    },
    glowBottom: {
      position: 'absolute',
      bottom: -160,
      right: -110,
      width: 320,
      height: 320,
      borderRadius: 160,
      backgroundColor: colors.successSoft,
      opacity: 0.18,
    },
    content: {
      flexGrow: 1,
      paddingHorizontal: spacing.s24,
      paddingTop: spacing.s4,
      paddingBottom: spacing.s12,
    },
    headerWrap: {
      paddingHorizontal: spacing.s24,
    },
    subtitle: {
      marginTop: spacing.s8,
      color: colors.muted,
      fontSize: typography.size.base,
      lineHeight: 26,
      maxWidth: '95%',
    },
    formWrap: {
      marginTop: spacing.s24,
      gap: spacing.s18,
    },
    inputBlock: {
      gap: spacing.s8,
    },
    inputLabel: {
      color: colors.textSecondary,
      fontSize: 17,
      letterSpacing: 0.6,
      fontWeight: typography.weight.semiBold,
      textTransform: 'uppercase',
    },
    inputBox: {
      height: 56,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.s16,
    },
    input: {
      flex: 1,
      color: colors.textPrimary,
      fontSize: typography.size.md,
      paddingVertical: 0,
    },
    eyeButton: {
      width: 34,
      height: 34,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    eyeButtonPressed: {
      backgroundColor: colors.surfaceMuted,
    },
    eyeText: {
      color: colors.muted,
      fontSize: 18,
    },
    strengthHeader: {
      marginTop: spacing.s8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    strengthLabel: {
      color: colors.textSecondary,
      fontSize: typography.size.sm,
      fontWeight: typography.weight.semiBold,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    strengthValue: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.bold,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    strengthBars: {
      marginTop: spacing.s8,
      flexDirection: 'row',
      gap: spacing.s8,
    },
    strengthBar: {
      flex: 1,
      height: 5,
      borderRadius: 999,
      backgroundColor: colors.border,
    },
    hintCard: {
      marginTop: spacing.s10,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      padding: spacing.s14,
      flexDirection: 'row',
      gap: spacing.s12,
    },
    hintIconWrap: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: colors.successSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
    },
    hintIcon: {
      fontSize: 14,
    },
    hintBody: {
      flex: 1,
    },
    hintTitle: {
      color: colors.textPrimary,
      fontSize: typography.size.md,
      fontWeight: typography.weight.semiBold,
      textTransform: 'uppercase',
    },
    hintDescription: {
      marginTop: spacing.s4,
      color: colors.muted,
      fontSize: typography.size.sm,
      lineHeight: 20,
    },
    errorText: {
      marginTop: spacing.s8,
      color: colors.error,
      fontSize: typography.size.sm,
    },
    ctaWrap: {
      marginTop: spacing.s28,
      paddingBottom: spacing.s8,
      gap: spacing.s12,
    },
    ctaButton: {
      borderRadius: 30,
      minHeight: 64,
    },
    ctaText: {
      color: '#062A1A',
      fontWeight: typography.weight.bold,
      fontSize: typography.size.base,
      letterSpacing: 2,
      textTransform: 'uppercase',
    },
    changedText: {
      textAlign: 'center',
      color: colors.muted,
      fontSize: typography.size.sm,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
  });
