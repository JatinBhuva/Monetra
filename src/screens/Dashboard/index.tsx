import React from 'react';
import { Text, View } from 'react-native';

import { CustomInput } from '../../components';
import { useDashboard } from './Dashboard.hook';
import { styles } from './styles';

const DashboardScreen = () => {
  const { greeting } = useDashboard();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>{greeting}</Text>
      <CustomInput label="Sample input" placeholder="Type here..." />
    </View>
  );
};

export default DashboardScreen;
