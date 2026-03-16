import React from 'react';
import {
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { CustomInput } from '../CustomInput';
import { getAccentBorderStyle, styles } from './styles';

type DateInputProps = {
  label: string;
  value: string;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  isFocused?: boolean;
  accentColor?: string;
  icon?: string;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<TextStyle>;
};

export const DateInput = ({
  label,
  value,
  onPress,
  onPressIn,
  onPressOut,
  isFocused,
  accentColor,
  icon,
  placeholder,
  containerStyle,
  inputStyle,
  iconStyle,
}: DateInputProps) => {
  const accentBorderStyle = getAccentBorderStyle(accentColor, isFocused);

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <CustomInput
        label={label}
        value={value}
        editable={false}
        placeholder={placeholder}
        isFocused={isFocused}
        containerStyle={[
          accentBorderStyle,
          containerStyle,
        ]}
        inputStyle={[styles.input, inputStyle]}
        trailingElement={
          icon ? <Text style={[styles.icon, iconStyle]}>{icon}</Text> : undefined
        }
      />
    </Pressable>
  );
};
