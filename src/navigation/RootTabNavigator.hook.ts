import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { LoggedInStackParamList } from '../types';
import { ScreenConstants } from '../utils/constants';

export type AddEntryType = 'expense' | 'income';

export const useRootTabNavigator = () => {
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<LoggedInStackParamList>>();

  const openAddFlow = useCallback(
    (type: AddEntryType) => {
      setIsQuickActionOpen(false);
      navigation.navigate(ScreenConstants.ADD_TRANSACTION_SCREEN, {
        initialType: type,
      });
    },
    [navigation],
  );

  const openInvestmentFlow = useCallback(() => {
    setIsQuickActionOpen(false);
    navigation.navigate(ScreenConstants.ADD_INVESTMENT_SCREEN);
  }, [navigation]);

  return {
    isQuickActionOpen,
    setIsQuickActionOpen,
    openAddFlow,
    openInvestmentFlow,
  };
};
