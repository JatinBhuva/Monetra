import { createBottomTabNavigator, type BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import DashboardScreen from '../screens/Dashboard';
import AddTransactionScreen from '../screens/AddTransaction';
import TransactionsScreen from '../screens/Transactions';
import AnalysisScreen from '../screens/Analysis';
import SettingsScreen from '../screens/Settings';
import type { RootTabParamList } from '../types';
import { ScreenConstants } from '../utils/constants';
import { strings } from '../utils/strings';
import { colors } from '../theme';

import { assets } from '../assets';

const Tab = createBottomTabNavigator<RootTabParamList>();

const ACTIVE_COLOR = '#0B142A';
const INACTIVE_COLOR = '#9AA3B2';

const DashboardIcon = assets.icons.dashboard;
const AddIcon = assets.icons.add;
const TransactionsIcon = assets.icons.transactions;
const AnalysisIcon = assets.icons.analysis;
const SettingsIcon = assets.icons.settings;

type TabIconProps = {
  color: string;
};

const DashboardTabIcon = ({ color }: TabIconProps) => (
  <DashboardIcon width={24} height={24} fill={color} />
);

const TransactionsTabIcon = ({ color }: TabIconProps) => (
  <TransactionsIcon width={24} height={24} fill={color} />
);

const AddTabIcon = ({ color }: TabIconProps) => (
  <AddIcon width={24} height={24} fill={color} />
);

const AnalysisTabIcon = ({ color }: TabIconProps) => (
  <AnalysisIcon width={24} height={24} fill={color} />
);

const SettingsTabIcon = ({ color }: TabIconProps) => (
  <SettingsIcon width={24} height={24} fill={color} />
);

const TabBarBackground = () => (
  <View style={styles.tabBarBackground}>
    <View style={styles.tabBarNotch} />
  </View>
);

const AddTabButton = ({
  onPress,
  accessibilityLabel,
  style,
}: BottomTabBarButtonProps) => (
  <Pressable
    onPress={onPress}
    style={[styles.addButtonWrapper, style]}
    accessibilityLabel={accessibilityLabel}
  >
    <View style={styles.addButton}>
      <AddIcon width={24} height={24} fill="#FFFFFF" />
    </View>
  </Pressable>
);

const EmptyTabBarLabel = () => null;

export const RootTabNavigator = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const screenOptions = {
    headerShown: false,
    tabBarShowLabel: false,
    tabBarActiveTintColor: ACTIVE_COLOR,
    tabBarInactiveTintColor: INACTIVE_COLOR,
    tabBarStyle: styles.tabBar,
    tabBarBackground: TabBarBackground,
  };

  return (
    <>
      <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name={ScreenConstants.DASHBOARD_SCREEN}
        component={DashboardScreen}
        options={{
          title: strings.navigation.dashboard,
          tabBarIcon: DashboardTabIcon,
        }}
      />
      <Tab.Screen
        name={ScreenConstants.TRANSACTIONS_SCREEN}
        component={TransactionsScreen}
        options={{
          title: strings.navigation.transactions,
          tabBarIcon: TransactionsTabIcon,
        }}
      />
      <Tab.Screen
        name={ScreenConstants.ADD_ACTION}
        component={DashboardScreen}
        options={{
          title: '',
          tabBarLabel: EmptyTabBarLabel,
          tabBarIcon: AddTabIcon,
          tabBarButton: AddTabButton,
        }}
        listeners={{
          tabPress: e => {
            e.preventDefault();
            setIsAddOpen(true);
          },
        }}
      />
      <Tab.Screen
        name={ScreenConstants.ANALYSIS_SCREEN}
        component={AnalysisScreen}
        options={{
          title: strings.navigation.analysis,
          tabBarIcon: AnalysisTabIcon,
        }}
      />
      <Tab.Screen
        name={ScreenConstants.SETTINGS_SCREEN}
        component={SettingsScreen}
        options={{
          title: strings.navigation.settings,
          tabBarIcon: SettingsTabIcon,
        }}
      />
    </Tab.Navigator>
      <Modal
        transparent
        animationType="slide"
        visible={isAddOpen}
        onRequestClose={() => setIsAddOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setIsAddOpen(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <AddTransactionScreen
              onClose={() => setIsAddOpen(false)}
              accentColor={ACTIVE_COLOR}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
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
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    transform: [{ translateY: -20 }],
  },
  tabBarBackground: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: 1,
    shadowColor: '#0B142A',
    shadowOpacity: 0.08,
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
    backgroundColor: colors.background,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'stretch',
    justifyContent: 'flex-end',
  },
  modalCard: {
    flex: 1,
  },
});
