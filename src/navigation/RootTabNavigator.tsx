import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';

import { QuickActionModal } from '../components';
import DashboardScreen from '../screens/Dashboard';
import TransactionsScreen from '../screens/Transactions';
import AnalysisScreen from '../screens/Analysis';
import SettingsScreen from '../screens/Settings';
import type { RootTabParamList } from '../types';
import { ScreenConstants } from '../utils/constants';
import { strings } from '../utils/strings';
import { useAppTheme } from '../theme';
import { assets } from '../assets';
import { useRootTabNavigator } from './RootTabNavigator.hook';
import { createRootTabStyles } from './RootTabNavigator.styles';

const Tab = createBottomTabNavigator<RootTabParamList>();

export const RootTabNavigator = () => {
  const { colors, isDark } = useAppTheme();
  const { isQuickActionOpen, setIsQuickActionOpen, openAddFlow, openInvestmentFlow } =
    useRootTabNavigator();

  const styles = useMemo(() => createRootTabStyles(colors, isDark), [colors, isDark]);

  const DashboardIcon = assets.icons.dashboard;
  const AddIcon = assets.icons.add;
  const TransactionsIcon = assets.icons.transactions;
  const AnalysisIcon = assets.icons.analysis;
  const SettingsIcon = assets.icons.settings;

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      tabBarShowLabel: false,
      tabBarActiveTintColor: colors.tabActive,
      tabBarInactiveTintColor: colors.tabInactive,
      tabBarStyle: styles.tabBar,
      tabBarBackground: () => (
        <View style={styles.tabBarBackground}>
          <View style={styles.tabBarNotch} />
        </View>
      ),
    }),
    [colors.tabActive, colors.tabInactive, styles],
  );

  return (
    <>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen
          name={ScreenConstants.DASHBOARD_SCREEN}
          component={DashboardScreen}
          options={{
            title: strings.navigation.dashboard,
            tabBarIcon: ({ color }) => (
              <DashboardIcon width={24} height={24} fill={color} />
            ),
          }}
        />
        <Tab.Screen
          name={ScreenConstants.TRANSACTIONS_SCREEN}
          component={TransactionsScreen}
          options={{
            title: strings.navigation.transactions,
            tabBarIcon: ({ color }) => (
              <TransactionsIcon width={24} height={24} fill={color} />
            ),
          }}
        />
        <Tab.Screen
          name={ScreenConstants.ADD_ACTION}
          component={DashboardScreen}
          options={{
            title: '',
            tabBarLabel: () => null,
            tabBarIcon: ({ color }) => <AddIcon width={24} height={24} fill={color} />,
            tabBarButton: props => {
              const {
                accessibilityState,
                accessibilityRole,
                accessibilityHint,
                testID,
                style,
              } = props;
              return (
                <Pressable
                  onPress={() => openAddFlow('expense')}
                  onLongPress={() => setIsQuickActionOpen(true)}
                  style={[styles.addButtonWrapper, style]}
                  accessibilityLabel={strings.navigation.addAccessibility}
                  accessibilityState={accessibilityState}
                  accessibilityRole={accessibilityRole}
                  accessibilityHint={accessibilityHint}
                  testID={testID}
                >
                  <View style={styles.addButton}>
                    <AddIcon width={24} height={24} fill={colors.primaryContrast} />
                  </View>
                </Pressable>
              );
            },
          }}
          listeners={{
            tabPress: e => {
              e.preventDefault();
              openAddFlow('expense');
            },
          }}
        />
        <Tab.Screen
          name={ScreenConstants.ANALYSIS_SCREEN}
          component={AnalysisScreen}
          options={{
            title: strings.navigation.analysis,
            tabBarIcon: ({ color }) => (
              <AnalysisIcon width={24} height={24} fill={color} />
            ),
          }}
        />
        <Tab.Screen
          name={ScreenConstants.SETTINGS_SCREEN}
          component={SettingsScreen}
          options={{
            title: strings.navigation.settings,
            tabBarIcon: ({ color }) => (
              <SettingsIcon width={24} height={24} fill={color} />
            ),
          }}
        />
      </Tab.Navigator>
      <QuickActionModal
        visible={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        onAddExpense={() => openAddFlow('expense')}
        onAddInvestment={openInvestmentFlow}
        onAddIncome={() => openAddFlow('income')}
      />
    </>
  );
};
