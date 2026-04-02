import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { SvgProps } from 'react-native-svg';

type QuickActionCardStyles = {
  entryCard: StyleProp<ViewStyle>;
  entryCardDecorWrap: StyleProp<ViewStyle>;
  entryCardIconWrap: StyleProp<ViewStyle>;
  entryCardTitle: StyleProp<TextStyle>;
  entryCardDescription: StyleProp<TextStyle>;
  entryCardAction: StyleProp<TextStyle>;
};

type QuickActionCardProps = {
  styles: QuickActionCardStyles;
  title: string;
  description: string;
  actionText: string;
  onPress: () => void;
  DecorIcon: React.ComponentType<SvgProps>;
  MainIcon: React.ComponentType<SvgProps>;
  decorWrapStyle?: StyleProp<ViewStyle>;
  iconWrapStyle?: StyleProp<ViewStyle>;
  actionStyle?: StyleProp<TextStyle>;
  decorIconStyle?: StyleProp<ViewStyle>;
  mainIconStyle?: StyleProp<ViewStyle>;
  decorFill: string;
  mainFill: string;
};

const QuickActionCard = ({
  styles,
  title,
  description,
  actionText,
  onPress,
  DecorIcon,
  MainIcon,
  decorWrapStyle,
  iconWrapStyle,
  actionStyle,
  decorIconStyle,
  mainIconStyle,
  decorFill,
  mainFill,
}: QuickActionCardProps) => (
  <Pressable style={styles.entryCard} onPress={onPress}>
    <View style={[styles.entryCardDecorWrap, decorWrapStyle]}>
      <DecorIcon style={decorIconStyle} fill={decorFill} />
    </View>
    <View style={[styles.entryCardIconWrap, iconWrapStyle]}>
      <MainIcon style={mainIconStyle} fill={mainFill} />
    </View>
    <Text style={styles.entryCardTitle}>{title}</Text>
    <Text style={styles.entryCardDescription}>{description}</Text>
    <Text style={[styles.entryCardAction, actionStyle]}>{actionText}</Text>
  </Pressable>
);

export default QuickActionCard;
