import React, { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CustomInput, DateInput, PrimaryActionButton } from '../../components';
import { colors, spacing } from '../../theme';
import { resolveCategoryLabel } from '../../utils/categoryLabel';
import { strings } from '../../utils/strings';
import { useAddTransaction } from './AddTransaction.hook';
import { createAccentStyles, styles } from './styles';

type AddTransactionProps = {
  onClose?: () => void;
  accentColor?: string;
};

const AddTransactionScreen = ({
  onClose,
  accentColor,
}: AddTransactionProps) => {
  const insets = useSafeAreaInsets();
  const accent = accentColor ?? colors.primary;
  const accentStyles = useMemo(() => createAccentStyles(accent), [accent]);
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
    selectedDate,
    showDatePicker,
    setShowDatePicker,
    formattedDate,
    isSubmitDisabled,
    isSaving,
    showAmountError,
    showDescriptionError,
    showCategoryError,
    handleCategorySelect,
    handleAmountBlur,
    handleDescriptionBlur,
    categories: storedCategories,
    handleSubmit,
    handleDateChange,
  } = useAddTransaction({
    dateLocale: strings.transactions.dateLocale,
    onClose,
  });

  const categories = useMemo(
    () => storedCategories.filter(category => category.type === activeType),
    [activeType, storedCategories],
  );

  return (
    <View style={styles.screen}>
      <View style={[styles.headerRow, { paddingTop: spacing.xl + insets.top }]}>
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
                  activeType === 'expense' ? accentStyles.segmentTextAccent : null,
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
                  activeType === 'income' ? accentStyles.segmentTextAccent : null,
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
            onBlur={() => {
              setFocusedField(null);
              handleAmountBlur();
            }}
            containerStyle={
              focusedField === 'amount' ? accentStyles.inputFocusBorder : null
            }
          />
          {showAmountError ? (
            <Text style={styles.errorText}>
              {strings.transactions.amountError}
            </Text>
          ) : null}

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
            onBlur={() => {
              setFocusedField(null);
              handleDescriptionBlur();
            }}
            containerStyle={
              focusedField === 'description' ? accentStyles.inputFocusBorder : null
            }
          />
          {showDescriptionError ? (
            <Text style={styles.errorText}>
              {strings.transactions.descriptionError}
            </Text>
          ) : null}

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
                    onPress={() => handleCategorySelect(category.id)}
                    style={[
                      styles.categoryCard,
                      isSelected && styles.categoryCardActive,
                      isSelected ? accentStyles.categoryCardAccent : null,
                    ]}
                  >
                    <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                    <Text
                      style={[
                        styles.categoryLabel,
                        isSelected && styles.categoryLabelActive,
                        isSelected ? accentStyles.categoryLabelAccent : null,
                      ]}
                    >
                      {resolveCategoryLabel(category)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {showCategoryError ? (
              <Text style={styles.errorText}>
                {strings.transactions.categoryError}
              </Text>
            ) : null}
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
          isLoading={isSaving}
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
};

export default AddTransactionScreen;
