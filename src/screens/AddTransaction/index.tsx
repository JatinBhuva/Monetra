import React, { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { CustomInput, DateInput, PrimaryActionButton } from '../../components';
import { colors } from '../../theme';
import { transactionCategories } from '../../utils/categories';
import { strings } from '../../utils/strings';
import { useAddTransaction } from './AddTransaction.hook';
import { styles } from './styles';

type AddTransactionProps = {
  onClose?: () => void;
  accentColor?: string;
};

const AddTransactionScreen = ({
  onClose,
  accentColor,
}: AddTransactionProps) => {
  const accent = accentColor ?? colors.primary;
  const {
    activeType,
    setActiveType,
    focusedField,
    setFocusedField,
    amount,
    setAmount,
    description,
    setDescription,
    selectedCategory,
    setSelectedCategory,
    selectedDate,
    showDatePicker,
    setShowDatePicker,
    formattedDate,
    isSubmitDisabled,
    handleDateChange,
  } = useAddTransaction({ dateLocale: strings.transactions.dateLocale });

  const categories = useMemo(
    () =>
      activeType === 'expense'
        ? transactionCategories.expense
        : transactionCategories.income,
    [activeType],
  );

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>{strings.transactions.title}</Text>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeIcon}>{strings.transactions.closeIcon}</Text>
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.segmentedControl}>
            <Pressable
              onPress={() => setActiveType('expense')}
              style={[
                styles.segment,
                activeType === 'expense' && styles.segmentActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  activeType === 'expense' && styles.segmentTextActive,
                  activeType === 'expense' ? { color: accent } : null,
                ]}
              >
                {strings.transactions.expense}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveType('income')}
              style={[
                styles.segment,
                activeType === 'income' && styles.segmentActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  activeType === 'income' && styles.segmentTextActive,
                  activeType === 'income' ? { color: accent } : null,
                ]}
              >
                {strings.transactions.income}
              </Text>
            </Pressable>
          </View>

          <CustomInput
            label={strings.transactions.amountLabel}
            value={amount}
            onChangeText={setAmount}
            placeholder={strings.transactions.amountPlaceholder}
            keyboardType="numeric"
            leadingText={strings.transactions.currencySymbol}
            isFocused={focusedField === 'amount'}
            onFocus={() => setFocusedField('amount')}
            onBlur={() => setFocusedField(null)}
            containerStyle={
              focusedField === 'amount' ? { borderColor: accent } : null
            }
          />

          <CustomInput
            label={strings.transactions.descriptionLabel}
            value={description}
            onChangeText={setDescription}
            placeholder={
              activeType === 'expense'
                ? strings.transactions.expensePlaceholder
                : strings.transactions.incomePlaceholder
            }
            isFocused={focusedField === 'description'}
            onFocus={() => setFocusedField('description')}
            onBlur={() => setFocusedField(null)}
            containerStyle={
              focusedField === 'description' ? { borderColor: accent } : null
            }
          />

          <DateInput
            label={strings.transactions.dateLabel}
            value={formattedDate}
            icon={strings.transactions.dateIcon}
            isFocused={focusedField === 'date'}
            accentColor={accent}
            onPress={() => setShowDatePicker(true)}
            onPressIn={() => setFocusedField('date')}
            onPressOut={() => setFocusedField(null)}
          />
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>
              {strings.transactions.categoryLabel}
            </Text>
            <View style={styles.categoryGrid}>
              {categories.map(category => {
                const isSelected = selectedCategory === category.id;
                return (
                  <Pressable
                    key={category.id}
                    onPress={() => setSelectedCategory(category.id)}
                    style={[
                      styles.categoryCard,
                      isSelected && styles.categoryCardActive,
                      isSelected ? { borderColor: accent } : null,
                    ]}
                  >
                    <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                    <Text
                      style={[
                        styles.categoryLabel,
                        isSelected && styles.categoryLabelActive,
                        isSelected ? { color: accent } : null,
                      ]}
                    >
                      {category.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryActionButton
          label={
            activeType === 'expense'
              ? strings.transactions.addExpense
              : strings.transactions.addIncome
          }
          backgroundColor={accent}
          disabled={isSubmitDisabled}
        />
      </View>
    </View>
  );
};

export default AddTransactionScreen;
