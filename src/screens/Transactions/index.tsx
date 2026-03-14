import React from 'react';
import { Text, View } from 'react-native';

import { styles } from './styles';

const TransactionsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transactions</Text>
      <Text style={styles.subtitle}>All expenses and income in one place.</Text>
    </View>
  );
};

export default TransactionsScreen;
