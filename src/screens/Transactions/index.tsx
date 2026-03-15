import React from 'react';
import { Text, View } from 'react-native';

import { strings } from '../../utils/strings';
import { useTransactions } from './Transactions.hook';
import { styles } from './styles';

const TransactionsScreen = () => {
  useTransactions();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{strings.transactionsScreen.title}</Text>
      <Text style={styles.subtitle}>{strings.transactionsScreen.subtitle}</Text>
    </View>
  );
};

export default TransactionsScreen;
