import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import DashboardScreen from '../screens/Dashboard';
import TransactionsScreen from '../screens/Transactions';
import AnalysisScreen from '../screens/Analysis';
import SettingsScreen from '../screens/Settings';
import type { LoggedInStackParamList, RootTabParamList } from '../types';
import { ScreenConstants } from '../utils/constants';
import { strings } from '../utils/strings';
import { useAppTheme } from '../theme';
import { assets } from '../assets';

const Tab = createBottomTabNavigator<RootTabParamList>();
type AddEntryType = 'expense' | 'income';

export const RootTabNavigator = () => {
  const { colors, isDark } = useAppTheme();
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<LoggedInStackParamList>>();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        modalSafeArea: {
          flex: 1,
        },
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
        quickActionBackdrop: {
          flex: 1,
          backgroundColor: colors.overlay,
          justifyContent: 'flex-end',
          paddingHorizontal: 16,
          paddingBottom: 28,
        },
        quickActionSheet: {
          borderRadius: 28,
          backgroundColor: colors.surface,
          paddingHorizontal: 20,
          paddingTop: 22,
          paddingBottom: 14,
          shadowColor: colors.shadow,
          shadowOpacity: 0.12,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 10 },
          elevation: 10,
        },
        quickActionTitle: {
          fontSize: 18,
          fontWeight: '700',
          color: colors.textPrimary,
          marginBottom: 14,
        },
        quickActionButton: {
          minHeight: 52,
          borderRadius: 18,
          justifyContent: 'center',
          paddingHorizontal: 16,
          backgroundColor: colors.surfaceSecondary,
          marginBottom: 10,
        },
        quickActionButtonText: {
          fontSize: 16,
          fontWeight: '600',
          color: colors.textPrimary,
        },
        quickActionCancelButton: {
          backgroundColor: colors.surface,
          marginTop: 4,
          marginBottom: 0,
        },
        quickActionCancelText: {
          color: colors.muted,
        },
      }),
    [colors, isDark],
  );

  const DashboardIcon = assets.icons.dashboard;
  const AddIcon = assets.icons.add;
  const TransactionsIcon = assets.icons.transactions;
  const AnalysisIcon = assets.icons.analysis;
  const SettingsIcon = assets.icons.settings;

  const openAddFlow = (type: AddEntryType) => {
    setIsQuickActionOpen(false);
    navigation.navigate(ScreenConstants.ADD_TRANSACTION_SCREEN, {
      initialType: type,
    });
  };

  const openInvestmentFlow = () => {
    setIsQuickActionOpen(false);
    navigation.navigate(ScreenConstants.ADD_INVESTMENT_SCREEN);
  };

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
      <Modal
        transparent
        animationType="fade"
        visible={isQuickActionOpen}
        onRequestClose={() => setIsQuickActionOpen(false)}
      >
        <SafeAreaView edges={['bottom']} style={styles.modalSafeArea}>
          <Pressable
            style={styles.quickActionBackdrop}
            onPress={() => setIsQuickActionOpen(false)}
          >
            <Pressable style={styles.quickActionSheet} onPress={() => {}}>
              <Text style={styles.quickActionTitle}>
                {strings.transactions.quickActionTitle}
              </Text>
              <Pressable
                style={styles.quickActionButton}
                onPress={() => openAddFlow('expense')}
              >
                <Text style={styles.quickActionButtonText}>
                  {strings.transactions.quickActionExpense}
                </Text>
              </Pressable>
              <Pressable
                style={styles.quickActionButton}
                onPress={() => openAddFlow('income')}
              >
                <Text style={styles.quickActionButtonText}>
                  {strings.transactions.quickActionIncome}
                </Text>
              </Pressable>
              <Pressable
                style={styles.quickActionButton}
                onPress={openInvestmentFlow}
              >
                <Text style={styles.quickActionButtonText}>
                  {strings.transactions.quickActionInvestment}
                </Text>
              </Pressable>
              <Pressable
                style={styles.quickActionButton}
                onPress={openInvestmentFlow}
              >
                <Text style={styles.quickActionButtonText}>
                  {strings.transactions.quickActionWithdraw}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.quickActionButton, styles.quickActionCancelButton]}
                onPress={() => setIsQuickActionOpen(false)}
              >
                <Text
                  style={[
                    styles.quickActionButtonText,
                    styles.quickActionCancelText,
                  ]}
                >
                  {strings.transactions.quickActionCancel}
                </Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </SafeAreaView>
      </Modal>
    </>
  );
};
