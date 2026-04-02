import React, { useEffect, useRef, useState } from 'react';
import { AppState, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import type { Theme as NavigationTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BootSplash from 'react-native-bootsplash';

import { AppPasscodeGate, GlobalPopupContainer } from './components';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { useAppPasscode } from './hooks/useAppPasscode';
import { LoggedInNavigator } from './navigation';
import LoginScreen from './screens/Login';
import { store } from './store';
import { ThemeProvider, useAppTheme } from './theme';

const AppContent = () => {
  const SPLASH_MIN_DURATION_MS = 2000;
  const { session } = useAuth();
  const {
    isEnabled: isAppPasscodeEnabled,
    isLoading: isPasscodeLoading,
    verify,
  } = useAppPasscode();
  const { colors, isDark } = useAppTheme();
  const [hasSplashElapsed, setHasSplashElapsed] = useState(false);
  const [isLaunchReady, setIsLaunchReady] = useState(false);
  const [hasEnteredApp, setHasEnteredApp] = useState(false);
  const appStateRef = useRef(AppState.currentState);
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
    const timeoutId = setTimeout(() => {
      setHasSplashElapsed(true);
    }, SPLASH_MIN_DURATION_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [SPLASH_MIN_DURATION_MS]);

  useEffect(() => {
    if (!hasSplashElapsed) {
      return;
    }

    setIsLaunchReady(true);
  }, [hasSplashElapsed]);

  useEffect(() => {
    if (isLaunchReady) {
      BootSplash.hide({ fade: true });
    }
  }, [isLaunchReady]);

  useEffect(() => {
    if (!session) {
      setHasEnteredApp(false);
      return;
    }

    if (isPasscodeLoading) {
      return;
    }

    if (!isAppPasscodeEnabled) {
      setHasEnteredApp(true);
      return;
    }

    setHasEnteredApp(false);
  }, [isAppPasscodeEnabled, isPasscodeLoading, session]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      const wasInBackground =
        appStateRef.current === 'background' || appStateRef.current === 'inactive';

      appStateRef.current = nextState;

      if (
        session &&
        isAppPasscodeEnabled &&
        wasInBackground &&
        nextState === 'active'
      ) {
        setHasEnteredApp(false);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isAppPasscodeEnabled, session]);

  if (!isLaunchReady) {
    return null;
  }

  const shouldRenderNavigation =
    !session ||
    !isAppPasscodeEnabled ||
    hasEnteredApp;

  return (
    <View style={[styles.appContainer, { backgroundColor: colors.statusBarBackground }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={
          Platform.OS === 'android' ? colors.statusBarBackground : undefined
        }
        translucent={false}
      />
      {shouldRenderNavigation ? (
        <NavigationContainer theme={navigationTheme}>
          {session ? <LoggedInNavigator /> : <LoginScreen />}
        </NavigationContainer>
      ) : null}
      <AppPasscodeGate
        visible={Boolean(session) && isAppPasscodeEnabled && !hasEnteredApp}
        onVerify={verify}
        onUnlock={() => {
          setHasEnteredApp(true);
        }}
      />
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
