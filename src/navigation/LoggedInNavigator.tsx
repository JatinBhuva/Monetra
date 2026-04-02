import { Alert, DeviceEventEmitter } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';

import type { LoggedInStackParamList } from '../types';
import { deleteTransactionRequested } from '../store';
import { useAppDispatch } from '../store/hooks';
import { investmentRepository } from '../data/repositories/investmentRepository';
import { ScreenConstants } from '../utils/constants';
import { INVESTMENT_CREATED_EVENT } from '../utils/events';
import { strings } from '../utils/strings';
import { RootTabNavigator } from './RootTabNavigator';
import AddTransactionScreen from '../screens/AddTransaction';
import AddInvestmentScreen from '../screens/AddInvestment';
import InvestmentsScreen from '../screens/Investments';
import InvestmentDetailScreen from '../screens/Investments/InvestmentDetailScreen';
import MonthTransactionsScreen from '../screens/Transactions/MonthTransactionsScreen';
import TransactionDetailScreen from '../screens/Transactions/TransactionDetailScreen';
import CategoryBreakdownScreen from '../screens/Analysis/CategoryBreakdownScreen';
import ManageCategoriesScreen from '../screens/Settings/ManageCategoriesScreen';
import ProfileScreen from '../screens/Settings/ProfileScreen';
import PasswordSecurityScreen from '../screens/Settings/PasswordSecurity';
import ChangePasswordScreen from '../screens/Settings/ChangePasswordScreen';
import ChangePinScreen from '../screens/Settings/ChangePinScreen';

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
      existingTransaction={route.params.transaction}
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

const TransactionDetailRouteScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const route =
    useRoute<
      RouteProp<
        LoggedInStackParamList,
        typeof ScreenConstants.TRANSACTION_DETAIL_SCREEN
      >
    >();
  const { transaction } = route.params;

  return (
    <TransactionDetailScreen
      transaction={transaction}
      onBack={() => navigation.goBack()}
      onEdit={() =>
        navigation.navigate(
          ScreenConstants.ADD_TRANSACTION_SCREEN as never,
          {
            initialType: transaction.type,
            transaction,
          } as never,
        )
      }
      onDelete={() =>
        Alert.alert(
          strings.transactionsScreen.deleteTitle,
          strings.transactionsScreen.deleteMessage,
          [
            {
              text: strings.transactionsScreen.deleteCancel,
              style: 'cancel',
            },
            {
              text: strings.transactionsScreen.deleteConfirm,
              style: 'destructive',
              onPress: () => {
                dispatch(deleteTransactionRequested(transaction.id));
                navigation.goBack();
              },
            },
          ],
        )
      }
    />
  );
};

const AddInvestmentRouteScreen = () => {
  const navigation = useNavigation();
  const route =
    useRoute<
      RouteProp<LoggedInStackParamList, typeof ScreenConstants.ADD_INVESTMENT_SCREEN>
    >();

  return (
    <AddInvestmentScreen
      investmentToEdit={route.params?.investment}
      onClose={() => navigation.goBack()}
    />
  );
};

const InvestmentDetailRouteScreen = () => {
  const navigation = useNavigation<any>();
  const route =
    useRoute<
      RouteProp<
        LoggedInStackParamList,
        typeof ScreenConstants.INVESTMENT_DETAIL_SCREEN
      >
    >();
  const { investment } = route.params;

  return (
    <InvestmentDetailScreen
      investment={investment}
      onBack={() => navigation.goBack()}
      onEdit={() =>
        navigation.navigate(
          ScreenConstants.ADD_INVESTMENT_SCREEN as never,
          {
            investment,
          } as never,
        )
      }
      onDelete={() =>
        Alert.alert(
          strings.investments.deleteTitle,
          strings.investments.deleteMessage,
          [
            {
              text: strings.investments.deleteCancel,
              style: 'cancel',
            },
            {
              text: strings.investments.deleteConfirm,
              style: 'destructive',
              onPress: async () => {
                await investmentRepository.remove(investment.id);
                DeviceEventEmitter.emit(INVESTMENT_CREATED_EVENT);
                navigation.goBack();
              },
            },
          ],
        )
      }
    />
  );
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

const PasswordSecurityRouteScreen = () => {
  const navigation = useNavigation();

  return <PasswordSecurityScreen onBack={() => navigation.goBack()} />;
};

const ProfileRouteScreen = () => {
  const navigation = useNavigation();

  return <ProfileScreen onBack={() => navigation.goBack()} />;
};

const ChangePasswordRouteScreen = () => {
  const navigation = useNavigation();

  return <ChangePasswordScreen onBack={() => navigation.goBack()} />;
};

const ChangePinRouteScreen = () => {
  const navigation = useNavigation();

  return <ChangePinScreen onBack={() => navigation.goBack()} />;
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
      name={ScreenConstants.TRANSACTION_DETAIL_SCREEN}
      component={TransactionDetailRouteScreen}
    />
    <Stack.Screen
      name={ScreenConstants.ADD_INVESTMENT_SCREEN}
      component={AddInvestmentRouteScreen}
      options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
    />
    <Stack.Screen
      name={ScreenConstants.INVESTMENT_DETAIL_SCREEN}
      component={InvestmentDetailRouteScreen}
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
    <Stack.Screen
      name={ScreenConstants.PROFILE_SCREEN}
      component={ProfileRouteScreen}
    />
    <Stack.Screen
      name={ScreenConstants.PASSWORD_SECURITY_SCREEN}
      component={PasswordSecurityRouteScreen}
    />
    <Stack.Screen
      name={ScreenConstants.CHANGE_PASSWORD_SCREEN}
      component={ChangePasswordRouteScreen}
    />
    <Stack.Screen
      name={ScreenConstants.CHANGE_PIN_SCREEN}
      component={ChangePinRouteScreen}
    />
  </Stack.Navigator>
);
