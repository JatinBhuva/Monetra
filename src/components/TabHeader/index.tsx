import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styles } from './styles';
import { spacing } from '../../theme';

type TabHeaderProps = {
  title: string;
  subtitle?: string;
  rightAccessory?: React.ReactNode;
};

const TabHeader = ({ title, subtitle, rightAccessory }: TabHeaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: spacing.lg + insets.top }]}>
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
