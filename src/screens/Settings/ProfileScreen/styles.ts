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
      top: -110,
      left: -70,
      width: 240,
      height: 240,
      borderRadius: 120,
      backgroundColor: colors.accentBlueSoft,
      opacity: 0.22,
    },
    backgroundGlowBottom: {
      position: 'absolute',
      right: -90,
      bottom: -140,
      width: 260,
      height: 260,
      borderRadius: 130,
      backgroundColor: colors.successSoft,
      opacity: 0.2,
    },
    headerWrap: {
      paddingHorizontal: spacing.s24,
      paddingTop: spacing.s8,
    },
    content: {
      paddingHorizontal: spacing.s24,
      paddingBottom: spacing.s24,
    },
    avatarWrap: {
      alignItems: 'center',
      marginTop: spacing.s8,
      marginBottom: spacing.s24,
    },
    avatarCircle: {
      width: 116,
      height: 116,
      borderRadius: 58,
      borderWidth: 3,
      borderColor: colors.borderStrong,
      backgroundColor: colors.surfaceStrongAlt,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.s12,
    },
    avatarInitials: {
      color: colors.textPrimary,
      fontSize: 34,
      fontWeight: typography.weight.bold,
      letterSpacing: 1,
    },
    memberSince: {
      color: colors.muted,
      fontSize: typography.size.sm,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    fieldBlock: {
      marginBottom: spacing.s18,
    },
    fieldLabel: {
      marginBottom: spacing.s8,
      color: colors.muted,
      fontSize: typography.size.sm,
      fontWeight: typography.weight.semiBold,
      letterSpacing: 0.7,
      textTransform: 'uppercase',
    },
    input: {
      minHeight: 56,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.inputBackground,
      color: colors.textPrimary,
      fontSize: typography.size.md,
      paddingHorizontal: spacing.s16,
    },
    inputReadonly: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.borderStrong,
      color: colors.muted,
    },
    securityCard: {
      marginTop: spacing.s8,
      marginBottom: spacing.s22,
      borderRadius: 18,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.s16,
      paddingVertical: spacing.s14,
      flexDirection: 'row',
      gap: spacing.s12,
    },
    securityIconWrap: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: colors.successSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    securityIcon: {
      fontSize: typography.size.sm,
    },
    securityContent: {
      flex: 1,
      gap: spacing.s4,
    },
    securityTitle: {
      color: colors.textPrimary,
      fontSize: typography.size.md,
      fontWeight: typography.weight.semiBold,
    },
    securityDescription: {
      color: colors.muted,
      fontSize: typography.size.sm,
      lineHeight: 20,
    },
    errorText: {
      marginBottom: spacing.s12,
      color: colors.error,
      fontSize: typography.size.sm,
      fontWeight: typography.weight.medium,
    },
    saveButton: {
      marginTop: spacing.s4,
      borderRadius: 30,
      minHeight: 56,
      justifyContent: 'center',
    },
  });
