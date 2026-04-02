import { StyleSheet } from 'react-native';

import type { ThemeColors } from '../theme';

export const createRootTabStyles = (colors: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    tabBar: {
      position: 'absolute',
      left: 16,
      right: 16,
      bottom: 0,
      height: 78,
      borderTopWidth: 0,
      backgroundColor: 'transparent',
      elevation: 0,
      paddingBottom: 12,
      paddingTop: 10,
    },
    addButtonWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      zIndex: 2,
    },
    addButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: colors.primary,
      shadowColor: colors.shadow,
      shadowOpacity: 0.2,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 8,
      transform: [{ translateY: -20 }],
    },
    tabBarBackground: {
      flex: 1,
      backgroundColor: colors.tabBarBackground,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      zIndex: 1,
      shadowColor: colors.shadow,
      shadowOpacity: isDark ? 0.22 : 0.08,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 12,
    },
    tabBarNotch: {
      position: 'absolute',
      top: -18,
      alignSelf: 'center',
      width: 76,
      height: 76,
      borderRadius: 38,
      backgroundColor: colors.tabBarNotch,
    },
  });
