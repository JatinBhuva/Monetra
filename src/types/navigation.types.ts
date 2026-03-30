import type { NavigatorScreenParams } from '@react-navigation/native';

import { ScreenConstants } from '../utils/constants';

export type RootTabParamList = {
  [ScreenConstants.DASHBOARD_SCREEN]: undefined;
  [ScreenConstants.ADD_ACTION]: undefined;
  [ScreenConstants.TRANSACTIONS_SCREEN]: undefined;
  [ScreenConstants.ANALYSIS_SCREEN]: undefined;
  [ScreenConstants.SETTINGS_SCREEN]: undefined;
};

export type AnalysisCategoryBreakdownItem = {
  key: string;
  label: string;
  emoji: string;
  amount: number;
  count: number;
  progress: number;
};

export type LoggedInStackParamList = {
  [ScreenConstants.ROOT_TAB]: NavigatorScreenParams<RootTabParamList> | undefined;
  [ScreenConstants.ADD_TRANSACTION_SCREEN]: {
    initialType: 'expense' | 'income';
  };
  [ScreenConstants.MONTH_TRANSACTIONS_SCREEN]: {
    monthLabel: string;
    startDate: string;
    endDate: string;
  };
  [ScreenConstants.ANALYSIS_CATEGORIES_SCREEN]: {
    items: AnalysisCategoryBreakdownItem[];
  };
  [ScreenConstants.MANAGE_CATEGORIES_SCREEN]: undefined;
};
