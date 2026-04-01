import { StyleSheet } from 'react-native';

import { spacing, typography, type ThemeColors } from '../../../theme';

export const createStyles = (colors: ThemeColors) => StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.s24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.surfaceStrongAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.s12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
});
