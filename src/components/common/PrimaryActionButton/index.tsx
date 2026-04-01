import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { useThemedStyles } from '../../../theme';
import { createStyles } from './styles';

type PrimaryActionButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  backgroundColor?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export const PrimaryActionButton = ({
  label,
  onPress,
  disabled,
  isLoading,
  backgroundColor,
  textColor,
  style,
  textStyle,
}: PrimaryActionButtonProps) => {
  const styles = useThemedStyles(createStyles);
  const isDisabled = Boolean(disabled || isLoading);
  const spinnerColor = textColor ?? styles.label.color;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        backgroundColor ? { backgroundColor } : null,
        pressed && !isDisabled ? styles.buttonPressed : null,
        isDisabled ? styles.buttonDisabled : null,
        style,
      ]}
    >
      <View style={styles.contentRow}>
        {isLoading ? (
          <ActivityIndicator size="small" color={spinnerColor} />
        ) : null}
        <Text
          style={[
            styles.label,
            textColor ? { color: textColor } : null,
            textStyle,
          ]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
};
