import React, { useEffect } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import type { Theme as NavigationTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BootSplash from 'react-native-bootsplash';

import { GlobalPopupContainer } from './components';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { LoggedInNavigator } from './navigation';
import LoginScreen from './screens/Login';
import { store } from './store';
import { ThemeProvider, useAppTheme } from './theme';

const AppContent = () => {
  const { isHydrating, session } = useAuth();
  const { colors, isDark } = useAppTheme();
  const navigationTheme = React.useMemo<NavigationTheme>(
    () => ({
      dark: isDark,
      colors: {
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.textPrimary,
        border: colors.border,
        notification: colors.successBright,
      },
      fonts: {
        regular: { fontFamily: 'System', fontWeight: '400' },
        medium: { fontFamily: 'System', fontWeight: '500' },
        bold: { fontFamily: 'System', fontWeight: '700' },
        heavy: { fontFamily: 'System', fontWeight: '800' },
      },
    }),
    [colors, isDark],
  );

  useEffect(() => {
    if (!isHydrating) {
      BootSplash.hide({ fade: true });
    }
  }, [isHydrating]);

  if (isHydrating) {
    return null;
  }

  return (
    <View style={[styles.appContainer, { backgroundColor: colors.statusBarBackground }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={
          Platform.OS === 'android' ? colors.statusBarBackground : undefined
        }
        translucent={false}
      />
      <NavigationContainer theme={navigationTheme}>
        {session ? <LoggedInNavigator /> : <LoginScreen />}
      </NavigationContainer>
    </View>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
          <GlobalPopupContainer />
        </ThemeProvider>
      </SafeAreaProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
});

export default App;
