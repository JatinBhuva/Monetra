import React from 'react';
import { Text, View } from 'react-native';

import { useAnalysis } from './Analysis.hook';
import { styles } from './styles';

const AnalysisScreen = () => {
  useAnalysis();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analysis</Text>
      <Text style={styles.subtitle}>Trends, charts, and insights.</Text>
    </View>
  );
};

export default AnalysisScreen;
