import { StyleSheet } from 'react-native';

import { colors, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
    backgroundColor: colors.background,
  },
  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: spacing.s24,
    marginBottom: spacing.lg,
  },
  kicker: {
    color: '#B5C2E0',
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semiBold,
    letterSpacing: 1,
    marginBottom: spacing.s8,
  },
  title: {
    color: colors.surface,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.s8,
  },
  subtitle: {
    color: '#D7DDF0',
    fontSize: typography.size.sm,
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    shadowColor: '#0B142A',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  errorMessage: {
    color: colors.error,
    fontSize: typography.size.sm,
    marginBottom: spacing.md,
  },
  helperText: {
    marginTop: spacing.md,
    color: colors.muted,
    fontSize: typography.size.xs,
    textAlign: 'center',
  },
});
