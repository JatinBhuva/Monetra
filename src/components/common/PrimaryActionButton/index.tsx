import React from 'react';
import {
  Pressable,
  StyleProp,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';

import { styles } from './styles';

type PrimaryActionButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  backgroundColor?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export const PrimaryActionButton = ({
  label,
  onPress,
  disabled,
  backgroundColor,
  textColor,
  style,
  textStyle,
}: PrimaryActionButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        backgroundColor ? { backgroundColor } : null,
        pressed && !disabled ? styles.buttonPressed : null,
        disabled ? styles.buttonDisabled : null,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          textColor ? { color: textColor } : null,
          textStyle,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};
