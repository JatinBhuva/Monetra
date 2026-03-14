import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BootSplash from 'react-native-bootsplash';

import { RootTabNavigator } from './navigation';

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer onReady={() => BootSplash.hide({ fade: true })}>
        <RootTabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
