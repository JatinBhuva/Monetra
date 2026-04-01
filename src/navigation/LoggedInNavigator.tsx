import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';

import type { LoggedInStackParamList } from '../types';
import { ScreenConstants } from '../utils/constants';
import { RootTabNavigator } from './RootTabNavigator';
import AddTransactionScreen from '../screens/AddTransaction';
import AddInvestmentScreen from '../screens/AddInvestment';
import InvestmentsScreen from '../screens/Investments';
import MonthTransactionsScreen from '../screens/Transactions/MonthTransactionsScreen';
import CategoryBreakdownScreen from '../screens/Analysis/CategoryBreakdownScreen';
import ManageCategoriesScreen from '../screens/Settings/ManageCategoriesScreen';

const Stack = createNativeStackNavigator<LoggedInStackParamList>();

const AddTransactionRouteScreen = () => {
  const navigation = useNavigation();
  const route =
    useRoute<
      RouteProp<LoggedInStackParamList, typeof ScreenConstants.ADD_TRANSACTION_SCREEN>
    >();

  return (
    <AddTransactionScreen
      initialType={route.params.initialType}
      onClose={() => navigation.goBack()}
    />
  );
};

const MonthTransactionsRouteScreen = () => {
  const navigation = useNavigation();
  const route =
    useRoute<
      RouteProp<
        LoggedInStackParamList,
        typeof ScreenConstants.MONTH_TRANSACTIONS_SCREEN
      >
    >();

  return (
    <MonthTransactionsScreen
      monthLabel={route.params.monthLabel}
      startDate={route.params.startDate}
      endDate={route.params.endDate}
      onBack={() => navigation.goBack()}
    />
  );
};

const AddInvestmentRouteScreen = () => {
  const navigation = useNavigation();

  return <AddInvestmentScreen onClose={() => navigation.goBack()} />;
};

const InvestmentsRouteScreen = () => {
  const navigation = useNavigation();

  return <InvestmentsScreen onBack={() => navigation.goBack()} />;
};

const AnalysisCategoriesRouteScreen = () => {
  const navigation = useNavigation();
  const route =
    useRoute<
      RouteProp<
        LoggedInStackParamList,
        typeof ScreenConstants.ANALYSIS_CATEGORIES_SCREEN
      >
    >();

  return (
    <CategoryBreakdownScreen
      items={route.params.items}
      onBack={() => navigation.goBack()}
    />
  );
};

const ManageCategoriesRouteScreen = () => {
  const navigation = useNavigation();

  return <ManageCategoriesScreen onBack={() => navigation.goBack()} />;
};

export const LoggedInNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen name={ScreenConstants.ROOT_TAB} component={RootTabNavigator} />
    <Stack.Screen
      name={ScreenConstants.ADD_TRANSACTION_SCREEN}
      component={AddTransactionRouteScreen}
      options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
    />
    <Stack.Screen
      name={ScreenConstants.ADD_INVESTMENT_SCREEN}
      component={AddInvestmentRouteScreen}
      options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
    />
    <Stack.Screen
      name={ScreenConstants.INVESTMENTS_SCREEN}
      component={InvestmentsRouteScreen}
    />
    <Stack.Screen
      name={ScreenConstants.MONTH_TRANSACTIONS_SCREEN}
      component={MonthTransactionsRouteScreen}
    />
    <Stack.Screen
      name={ScreenConstants.ANALYSIS_CATEGORIES_SCREEN}
      component={AnalysisCategoriesRouteScreen}
    />
    <Stack.Screen
      name={ScreenConstants.MANAGE_CATEGORIES_SCREEN}
      component={ManageCategoriesRouteScreen}
    />
  </Stack.Navigator>
);
