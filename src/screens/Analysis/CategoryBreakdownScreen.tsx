import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemedStyles } from '../../theme';
import { strings } from '../../utils/strings';
import { createStyles } from './styles';

type CategoryBreakdownItem = {
  key: string;
  label: string;
  emoji: string;
  amount: number;
  count: number;
  progress: number;
};

type CategoryBreakdownScreenProps = {
  items: CategoryBreakdownItem[];
  onBack: () => void;
};

const formatCurrency = (amount: number) =>
  `${strings.transactions.currencySymbol}${amount.toLocaleString(
    strings.transactions.dateLocale,
    {
      maximumFractionDigits: 0,
    },
  )}`;

const CategoryBreakdownScreen = ({ items, onBack }: CategoryBreakdownScreenProps) => {
  const styles = useThemedStyles(createStyles);
  return (
    <SafeAreaView edges={['top']} style={styles.breakdownScreen}>
      <View style={styles.breakdownHeader}>
        <Pressable onPress={onBack} style={styles.breakdownBackButton}>
          <Text style={styles.breakdownBackIcon}>‹</Text>
        </Pressable>
        <Text style={styles.breakdownTitle}>
          {strings.analysisScreen.allCategoriesTitle}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.breakdownList}
      >
        <View style={styles.breakdownGrid}>
          {items.map(item => (
            <View key={item.key} style={styles.breakdownTile}>
              <View style={styles.breakdownTileIconBox}>
                <Text style={styles.categoryEmoji}>{item.emoji}</Text>
              </View>
              <Text style={styles.breakdownTileTitle}>{item.label}</Text>
              <Text style={styles.breakdownTileMeta}>{item.count} Transactions</Text>
              <Text style={styles.breakdownTileAmount}>
                {formatCurrency(item.amount)}
              </Text>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.max(16, item.progress * 100)}%` },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CategoryBreakdownScreen;
