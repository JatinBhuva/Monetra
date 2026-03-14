import React from 'react';
import { Text, View } from 'react-native';

import { styles } from './styles';

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Manage your preferences here.</Text>
    </View>
  );
};

export default SettingsScreen;
