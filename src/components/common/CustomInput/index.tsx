import React from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { colors } from '../../../theme';
import { styles } from './styles';

type CustomInputProps = Omit<TextInputProps, 'style'> & {
  label?: string;
  isFocused?: boolean;
  leadingText?: string;
  trailingElement?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  leadingTextStyle?: TextStyle;
};

export const CustomInput = ({
  label,
  isFocused,
  leadingText,
  trailingElement,
  containerStyle,
  inputStyle,
  labelStyle,
  leadingTextStyle,
  placeholderTextColor = colors.muted,
  ...textInputProps
}: CustomInputProps) => {
  return (
    <View style={styles.block}>
      {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
      <View
        style={[
          styles.inputWrapper,
          isFocused ? styles.inputWrapperFocused : null,
          containerStyle,
        ]}
      >
        {leadingText ? (
          <Text style={[styles.leadingText, leadingTextStyle]}>{leadingText}</Text>
        ) : null}
        <TextInput
          placeholderTextColor={placeholderTextColor}
          style={[styles.input, inputStyle]}
          {...textInputProps}
        />
        {trailingElement}
      </View>
    </View>
  );
};
