import React from 'react';
import { Text, TextInput, View } from 'react-native';

import { styles } from './styles';

type ExampleInputProps = {
  label: string;
  placeholder?: string;
};

export const ExampleInput = ({ label, placeholder }: ExampleInputProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#8B8B8B"
        style={styles.input}
      />
    </View>
  );
};
