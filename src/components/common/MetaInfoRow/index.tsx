import React from 'react';
import { Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { useThemedStyles } from '../../../theme';
import { createStyles } from './styles';

type MetaInfoRowProps = {
  label: string;
  value: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
};

const MetaInfoRow = ({
  label,
  value,
  containerStyle,
  labelStyle,
  valueStyle,
}: MetaInfoRowProps) => {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.row, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <Text style={[styles.value, valueStyle]}>{value}</Text>
    </View>
  );
};

export default MetaInfoRow;
