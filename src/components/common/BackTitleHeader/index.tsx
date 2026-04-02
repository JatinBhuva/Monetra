import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { useThemedStyles } from '../../../theme';
import { createStyles } from './styles';

type BackTitleHeaderProps = {
  title: string;
  onBack?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
};

const BackTitleHeader = ({
  title,
  onBack,
  containerStyle,
}: BackTitleHeaderProps) => {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.container, containerStyle]}>
      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>‹</Text>
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.backButton} />
    </View>
  );
};

export default BackTitleHeader;
