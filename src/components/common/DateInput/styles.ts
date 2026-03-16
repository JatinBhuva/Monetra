import { StyleSheet } from 'react-native';

import { typography } from '../../../theme';

export const styles = StyleSheet.create({
  input: {
    fontSize: typography.size.md,
  },
  icon: {
    fontSize: typography.size.lg,
  },
});

export const getAccentBorderStyle = (
  accentColor?: string,
  isFocused?: boolean,
) => (isFocused && accentColor ? { borderColor: accentColor } : null);
