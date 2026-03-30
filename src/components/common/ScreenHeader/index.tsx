import React from 'react';
import { View, Text } from 'react-native';

import { useAppTheme, useThemedStyles } from '../../../theme';
import { createStyles } from './styles';

type ScreenHeaderProps = {
  title: string;
  icon: React.ComponentType<{ width?: number; height?: number; fill?: string }>;
};

const ScreenHeader = ({ title, icon: Icon }: ScreenHeaderProps) => {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.headerRow}>
      <View style={styles.headerLeft}>
        <View style={styles.headerIconWrap}>
          <Icon width={22} height={22} fill={colors.textInverse} />
        </View>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
    </View>
  );
};

export default ScreenHeader;
