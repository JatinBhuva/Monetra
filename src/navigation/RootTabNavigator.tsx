import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import DashboardScreen from '../screens/Dashboard';
import type { RootTabParamList } from '../types';
import { ScreenConstants } from '../utils/constants';

const Tab = createBottomTabNavigator<RootTabParamList>();

export const RootTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name={ScreenConstants.DASHBOARD_SCREEN}
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
    </Tab.Navigator>
  );
};
