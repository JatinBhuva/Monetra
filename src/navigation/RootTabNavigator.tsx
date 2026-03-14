import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import DashboardScreen from '../screens/Dashboard';
import TransactionsScreen from '../screens/Transactions';
import AnalysisScreen from '../screens/Analysis';
import SettingsScreen from '../screens/Settings';
import type { RootTabParamList } from '../types';
import { ScreenConstants } from '../utils/constants';
import { colors } from '../theme';

import { assets } from '../assets';

const Tab = createBottomTabNavigator<RootTabParamList>();

export const RootTabNavigator = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const activeColor = '#0B142A';
  const inactiveColor = '#9AA3B2';

  const DashboardIcon = assets.icons.dashboard;
  const AddIcon = assets.icons.add;
  const TransactionsIcon = assets.icons.transactions;
  const AnalysisIcon = assets.icons.analysis;
  const SettingsIcon = assets.icons.settings;

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      tabBarShowLabel: false,
      tabBarActiveTintColor: activeColor,
      tabBarInactiveTintColor: inactiveColor,
      tabBarStyle: styles.tabBar,
      tabBarBackground: () => (
        <View style={styles.tabBarBackground}>
          <View style={styles.tabBarNotch} />
        </View>
      ),
    }),
    []
  );

  return (
    <>
      <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name={ScreenConstants.DASHBOARD_SCREEN}
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <DashboardIcon width={24} height={24} fill={color} />,
        }}
      />
      <Tab.Screen
        name={ScreenConstants.TRANSACTIONS_SCREEN}
        component={TransactionsScreen}
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color }) => <TransactionsIcon width={24} height={24} fill={color} />,
        }}
      />
      <Tab.Screen
        name={ScreenConstants.ADD_ACTION}
        component={DashboardScreen}
        options={{
          title: '',
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => <AddIcon width={24} height={24} fill={color} />,
          tabBarButton: props => (
            <Pressable
              {...props}
              onPress={() => setIsAddOpen(true)}
              style={[styles.addButtonWrapper, props.style]}
              accessibilityLabel="Add"
            >
              <View style={styles.addButton}>
                <AddIcon width={24} height={24} fill="#FFFFFF" />
              </View>
            </Pressable>
          ),
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
          title: 'Analysis',
          tabBarIcon: ({ color }) => <AnalysisIcon width={24} height={24} fill={color} />,
        }}
      />
      <Tab.Screen
        name={ScreenConstants.SETTINGS_SCREEN}
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <SettingsIcon width={24} height={24} fill={color} />,
        }}
      />
    </Tab.Navigator>
      <Modal
        transparent
        animationType="fade"
        visible={isAddOpen}
        onRequestClose={() => setIsAddOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setIsAddOpen(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>Add</Text>
            <Text style={styles.modalSubtitle}>Your add action goes here.</Text>
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
    backgroundColor: '#0B142A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#1D2A4A',
    shadowColor: '#0B142A',
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0B142A',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#5C667A',
  },
});
