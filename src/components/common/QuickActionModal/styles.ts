import { StyleSheet } from 'react-native';

import { type ThemeColors } from '../../../theme';

export const createStyles = (colors: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    modalSafeArea: {
      flex: 1,
    },
    backdrop: {
      flex: 1,
      backgroundColor: isDark ? 'rgba(2, 8, 23, 0.78)' : '#EEF2F7',
      paddingHorizontal: 0,
      paddingBottom: 0,
    },
    sheet: {
      flex: 1,
      borderRadius: 0,
      backgroundColor: isDark ? '#07152B' : '#EEF2F7',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderWidth: 0,
    },
    scrollContent: {
      paddingBottom: 12,
    },
    title: {
      fontSize: 28,
      lineHeight: 36,
      fontWeight: '600',
      color: isDark ? '#EAF1FF' : '#1F2A3D',
      letterSpacing: 0.2,
    },
    subtitle: {
      marginTop: 8,
      marginBottom: 16,
      color: isDark ? '#96AAC6' : '#6D7F99',
      fontSize: 14,
      lineHeight: 20,
    },
    entryCard: {
      borderRadius: 20,
      backgroundColor: isDark ? '#0C1F3E' : '#FFFFFF',
      borderWidth: 1,
      borderColor: isDark ? '#173660' : '#E1E8F1',
      minHeight: 146,
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 14,
      marginBottom: 12,
      overflow: 'hidden',
    },
    entryCardIconWrap: {
      width: 34,
      height: 34,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
      backgroundColor: isDark ? '#173760' : '#EAF1FF',
    },
    entryCardIconWrapExpense: {
      backgroundColor: isDark ? '#173760' : '#EAF1FF',
    },
    entryCardIconWrapInvestment: {
      backgroundColor: isDark ? '#103A31' : '#CFF6E3',
    },
    entryCardIconWrapIncome: {
      backgroundColor: isDark ? '#1F2E4A' : '#DFEAFF',
    },
    entryCardExpenseIcon: {
      width: 22,
      height: 22,
      opacity: 1,
    },
    entryCardInvestmentIcon: {
      width: 22,
      height: 22,
      opacity: 1,
    },
    entryCardIncomeIcon: {
      width: 22,
      height: 22,
      opacity: 1,
    },
    entryCardTitle: {
      fontSize: 20,
      lineHeight: 31,
      fontWeight: '600',
      color: isDark ? '#EEF4FF' : '#202C3D',
      marginBottom: 8,
    },
    entryCardDescription: {
      fontSize: 14,
      lineHeight: 19,
      color: isDark ? '#A5B7D3' : '#6B7E99',
      marginBottom: 14,
    },
    entryCardAction: {
      fontSize: 15,
      fontWeight: '700',
      color: isDark ? '#8FB7FF' : '#2C7FDE',
    },
    entryCardActionInvestment: {
      color: isDark ? '#48D99B' : '#169A62',
    },
    entryCardActionIncome: {
      color: isDark ? '#D7E4FB' : '#2C3F5F',
    },
    entryCardDecorWrap: {
      position: 'absolute',
      right: -18,
      top: -10,
      width: 120,
      height: 120,
      alignItems: 'center',
      justifyContent: 'center',
    },
    entryCardDecorExpense: {
      right: -20,
      top: -12,
    },
    entryCardDecorInvestment: {
      right: -22,
      top: -14,
    },
    entryCardDecorIncome: {
      right: -22,
      top: -14,
    },
    entryCardDecorExpenseIcon: {
      width: 84,
      height: 84,
      opacity: isDark ? 0.16 : 0.14,
    },
    entryCardDecorInvestmentIcon: {
      width: 88,
      height: 88,
      opacity: isDark ? 0.16 : 0.14,
    },
    dismiss: {
      alignSelf: 'center',
      minHeight: 36,
      borderRadius: 18,
      paddingHorizontal: 18,
      backgroundColor: isDark ? '#2B3E5D' : '#DDE3EB',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dismissText: {
      color: isDark ? '#E2EAF8' : '#586980',
      fontSize: 13,
      fontWeight: '600',
    },
  });
