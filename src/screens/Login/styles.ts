import { StyleSheet } from 'react-native';

import { spacing, typography, type ThemeColors } from '../../theme';

export const createStyles = (colors: ThemeColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.s16,
    paddingVertical: spacing.s20,
    backgroundColor: colors.background,
  },
  logoWrap: {
    alignItems: 'center',
    marginTop: spacing.s12,
    marginBottom: spacing.s20,
  },
  logoBadge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBlock: {
    alignItems: 'center',
    marginBottom: spacing.s24,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.s10,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.muted,
    fontSize: typography.size.md,
    lineHeight: 28,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    paddingHorizontal: spacing.s20,
    paddingVertical: spacing.s28,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  inputContainer: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: 24,
    minHeight: 58,
    paddingHorizontal: spacing.s16,
    marginBottom: spacing.s16,
  },
  input: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
  },
  supportRow: {
    alignItems: 'flex-end',
    marginTop: -4,
    marginBottom: spacing.s20,
  },
  supportLink: {
    color: colors.primary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semiBold,
  },
  errorMessage: {
    color: colors.error,
    fontSize: typography.size.sm,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: spacing.s6,
    borderRadius: 24,
    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: spacing.s28,
  },
  footerText: {
    color: colors.muted,
    fontSize: typography.size.sm,
    marginRight: spacing.s6,
  },
  footerLink: {
    color: colors.primary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semiBold,
  },
});
