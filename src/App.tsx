import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BootSplash from 'react-native-bootsplash';

import { GlobalPopupContainer } from './components';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { RootTabNavigator } from './navigation';
import LoginScreen from './screens/Login';
import { store } from './store';

const AppContent = () => {
  const { isHydrating, session } = useAuth();

  useEffect(() => {
    if (!isHydrating) {
      BootSplash.hide({ fade: true });
    }
  }, [isHydrating]);

  if (isHydrating) {
    return null;
  }

  return (
    <NavigationContainer>
      {session ? <RootTabNavigator /> : <LoginScreen />}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
        <GlobalPopupContainer />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
