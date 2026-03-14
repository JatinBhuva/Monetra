import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootTabNavigator } from './navigation';

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootTabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
