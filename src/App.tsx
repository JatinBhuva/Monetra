import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BootSplash from 'react-native-bootsplash';

import { GlobalPopupContainer } from './components';
import { RootTabNavigator } from './navigation';
import { store } from './store';

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer onReady={() => BootSplash.hide({ fade: true })}>
          <RootTabNavigator />
        </NavigationContainer>
        <GlobalPopupContainer />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
