import React from 'react';
import {
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { useAppTheme, useThemedStyles } from '../../../theme';
import { createStyles } from './styles';

type CustomInputProps = Omit<TextInputProps, 'style'> & {
  label?: string;
  isFocused?: boolean;
  leadingText?: string;
  trailingElement?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  leadingTextStyle?: StyleProp<TextStyle>;
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
  placeholderTextColor,
  ...textInputProps
}: CustomInputProps) => {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);

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
          placeholderTextColor={placeholderTextColor ?? colors.muted}
          style={[styles.input, inputStyle]}
          {...textInputProps}
        />
        {trailingElement}
      </View>
    </View>
  );
};
