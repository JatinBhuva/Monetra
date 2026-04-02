import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CustomInput, ScreenHeader, TransactionRow } from '../../components';
import { assets } from '../../assets';
import { strings } from '../../utils/strings';
import { spacing, useThemedStyles } from '../../theme';
import { useTabBarSpacing } from '../../hooks/useTabBarSpacing';
import { useCurrencyPreference } from '../../hooks/useCurrencyPreference';
import { useTransactionsScreen } from './TransactionsScreen.hook';
import {
  formatTransactionAmount,
  type TransactionListItem,
} from './Transactions.utils';
import { createStyles } from './styles';

const TransactionsIcon = assets.icons.transactions;

const EmptyState = ({ styles }: { styles: ReturnType<typeof createStyles> }) => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyTitle}>
      {strings.transactionsScreen.emptyTitle}
    </Text>
    <Text style={styles.emptyMessage}>
      {strings.transactionsScreen.emptyMessage}
    </Text>
  </View>
);

const TransactionsScreen = () => {
  const styles = useThemedStyles(createStyles);
  const { currencySymbol } = useCurrencyPreference();
  const {
    searchValue,
    setSearchValue,
    listData,
    isInitialLoading,
    isRefreshing,
    isLoadingMore,
    loadMore,
    refresh,
    openTransactionDetails,
    openMonthTransactions,
  } = useTransactionsScreen();
  const tabBarSpacing = useTabBarSpacing(spacing.xxl);

  const renderItem: ListRenderItem<TransactionListItem> = ({ item }) => {
    if (item.kind === 'monthHeader') {
      return (
        <Pressable
          style={styles.monthHeader}
          onPress={() =>
            openMonthTransactions({
              monthLabel: item.label,
              startDate: item.startDate,
              endDate: item.endDate,
            })
          }
        >
          <Text style={styles.monthTitle}>{item.label}</Text>
          <View style={styles.monthMeta}>
            <Text style={styles.monthMetaLabel}>
              {strings.transactionsScreen.monthTotalLabel}
            </Text>
            <Text style={styles.monthMetaAmount}>
              {currencySymbol}
              {item.total}
            </Text>
          </View>
          <View style={styles.monthChevron}>
            <Text style={styles.monthChevronIcon}>›</Text>
          </View>
        </Pressable>
      );
    }
    if (item.kind === 'header') {
      return <Text style={styles.dayHeader}>{item.label}</Text>;
    }

    const { transaction } = item;
    const sign = transaction.type === 'expense' ? '-' : '+';
    const amountLabel = `${sign}${currencySymbol}${formatTransactionAmount(
      transaction.amount,
    )}`;

    return (
      <View style={styles.rowWrapper}>
        <Pressable onPress={() => openTransactionDetails(transaction)}>
          <TransactionRow
            transaction={transaction}
            amountLabel={amountLabel}
            amountTone={transaction.type}
          />
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.headerWrap}>
        <ScreenHeader
          title={strings.transactionsScreen.title}
          icon={TransactionsIcon}
        />
      </View>
      <View style={styles.searchWrap}>
        <CustomInput
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder={strings.transactionsScreen.searchPlaceholder}
          containerStyle={styles.searchInput}
          inputStyle={styles.searchInputText}
        />
      </View>
      {isInitialLoading ? (
        <View style={styles.fullScreenLoader}>
          <ActivityIndicator size="large" color={styles.loader.color} />
        </View>
      ) : (
        <FlashList
          data={listData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          estimatedItemSize={72}
          contentContainerStyle={StyleSheet.flatten([
            styles.listContent,
            { paddingBottom: tabBarSpacing },
          ])}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          onRefresh={refresh}
          refreshing={isRefreshing}
          ListEmptyComponent={<EmptyState styles={styles} />}
          ListFooterComponent={
            isLoadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={styles.loader.color} />
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
};

export default TransactionsScreen;
