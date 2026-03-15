import React from 'react';
import { Text, View } from 'react-native';

import { styles } from './styles';

type TabHeaderProps = {
  title: string;
  subtitle?: string;
  rightAccessory?: React.ReactNode;
};

const TabHeader = ({ title, subtitle, rightAccessory }: TabHeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightAccessory ? (
        <View style={styles.rightAccessory}>{rightAccessory}</View>
      ) : null}
    </View>
  );
};

export default TabHeader;
