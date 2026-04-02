import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CustomInput, DateInput, PrimaryActionButton } from '../../components';
import { useCurrencyPreference } from '../../hooks/useCurrencyPreference';
import type { Category } from '../../types/categories';
import type { Transaction } from '../../types/transactions';
import { useAppTheme, useThemedStyles } from '../../theme';
import { resolveCategoryLabel } from '../../utils/categoryLabel';
import { strings } from '../../utils/strings';
import { useAddTransaction } from './AddTransaction.hook';
import { createStyles } from './styles';

type AddTransactionProps = {
  onClose?: () => void;
  accentColor?: string;
  initialType: 'expense' | 'income';
  existingTransaction?: Transaction;
};

const FEATURED_ORDER = {
  expense: ['shopping', 'food', 'transport', 'bills'],
  income: ['salary', 'freelance'],
} as const;

const findOtherCategory = (categories: Category[]) =>
  categories.find(
    category =>
      category.labelKey?.endsWith('.other') ||
      category.name.trim().toLowerCase() === 'other',
  );

const sortByFeaturedOrder = (
  categories: Category[],
  type: 'expense' | 'income',
) => {
  const order = FEATURED_ORDER[type] as readonly string[];
  return [...categories].sort((left, right) => {
    const leftIndex = order.indexOf(left.id);
    const rightIndex = order.indexOf(right.id);

    if (leftIndex === -1 && rightIndex === -1) {
      return resolveCategoryLabel(left).localeCompare(
        resolveCategoryLabel(right),
      );
    }
    if (leftIndex === -1) {
      return 1;
    }
    if (rightIndex === -1) {
      return -1;
    }
    return leftIndex - rightIndex;
  });
};

const AddTransactionScreen = ({
  onClose,
  accentColor,
  initialType,
  existingTransaction,
}: AddTransactionProps) => {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  const { currencySymbol } = useCurrencyPreference();
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryEmoji, setCategoryEmoji] = useState('✨');
  const {
    isEditing,
    activeType,
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
    addCustomCategory,
  } = useAddTransaction({
    dateLocale: strings.transactions.dateLocale,
    initialType,
    existingTransaction,
    onClose,
  });
  const accent =
    activeType === 'expense' ? colors.success : accentColor ?? colors.primary;

  const categories = useMemo(
    () => storedCategories.filter(category => category.type === activeType),
    [activeType, storedCategories],
  );

  const visibleCategories = useMemo(() => {
    const otherCategory = findOtherCategory(categories);
    const featured = sortByFeaturedOrder(
      categories.filter(category => category.id !== otherCategory?.id),
      activeType,
    ).slice(0, 4);
    const selectedCategoryItem = categories.find(
      category => category.id === selectedCategory,
    );

    if (
      selectedCategoryItem &&
      !featured.some(category => category.id === selectedCategoryItem.id) &&
      otherCategory?.id !== selectedCategoryItem.id
    ) {
      const featuredWithSelection = [...featured];

      if (featuredWithSelection.length === 4) {
        featuredWithSelection.pop();
      }

      featuredWithSelection.push(selectedCategoryItem);

      return otherCategory
        ? [...featuredWithSelection, otherCategory]
        : featuredWithSelection;
    }

    return otherCategory ? [...featured, otherCategory] : featured;
  }, [activeType, categories, selectedCategory]);

  const allCategories = useMemo(
    () => sortByFeaturedOrder(categories, activeType),
    [activeType, categories],
  );

  const closeCategorySheet = () => {
    setIsCategorySheetOpen(false);
    setCategoryName('');
    setCategoryEmoji('✨');
  };

  const handleAddCategory = () => {
    const category = addCustomCategory(categoryName, categoryEmoji);
    if (!category) {
      return;
    }

    closeCategorySheet();
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.screen}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>
          {isEditing ? strings.transactions.editTitle : strings.transactions.title}
        </Text>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeIcon}>{strings.transactions.closeIcon}</Text>
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <CustomInput
            label={strings.transactions.amountLabel}
            value={amount}
            onChangeText={setAmount}
            placeholder={strings.transactions.amountPlaceholder}
            keyboardType="numeric"
            leadingText={currencySymbol}
            isFocused={focusedField === 'amount'}
            onFocus={() => setFocusedField('amount')}
            onBlur={() => {
              setFocusedField(null);
              handleAmountBlur();
            }}
            labelStyle={styles.formSectionLabel}
            leadingTextStyle={styles.currencySymbol}
            inputStyle={styles.amountInput}
            containerStyle={[
              styles.formInput,
              focusedField === 'amount' ? { borderColor: accent } : null,
            ]}
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
            labelStyle={styles.formSectionLabel}
            inputStyle={styles.formInputText}
            containerStyle={[
              styles.formInput,
              styles.notesInput,
              focusedField === 'description' ? { borderColor: accent } : null,
            ]}
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
            containerStyle={styles.formInput}
            inputStyle={styles.formInputText}
            iconStyle={styles.dateIcon}
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
            <View style={styles.categoryHeaderRow}>
              <Text style={styles.label}>
                {strings.transactions.categoryLabel}
              </Text>
              <Pressable onPress={() => setIsCategorySheetOpen(true)}>
                <Text style={[styles.moreLink, { color: accent }]}>
                  {strings.transactions.moreCategories}
                </Text>
              </Pressable>
            </View>
            <View style={styles.categoryRail}>
              {visibleCategories.map(category => {
                const isSelected = selectedCategory === category.id;
                return (
                  <Pressable
                    key={category.id}
                    onPress={() => handleCategorySelect(category.id)}
                    style={[
                      styles.categoryChip,
                      isSelected && styles.categoryChipActive,
                      isSelected ? { borderColor: accent } : null,
                    ]}
                  >
                    <Text style={styles.categoryChipEmoji}>
                      {category.emoji}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.categoryChipLabel,
                        isSelected && styles.categoryChipLabelActive,
                        isSelected ? { color: accent } : null,
                      ]}
                    >
                      {resolveCategoryLabel(category)}
                    </Text>
                  </Pressable>
                );
              })}
              <Pressable
                onPress={() => setIsCategorySheetOpen(true)}
                style={styles.moreChip}
              >
                <Text style={styles.moreChipPlus}>+</Text>
                <Text style={styles.moreChipLabel}>
                  {strings.transactions.moreCategories}
                </Text>
              </Pressable>
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
            isEditing
              ? strings.transactions.saveChanges
              : activeType === 'expense'
                ? strings.transactions.addExpense
                : strings.transactions.addIncome
          }
          backgroundColor={accent}
          style={styles.submitButton}
          disabled={isSubmitDisabled}
          isLoading={isSaving}
          onPress={handleSubmit}
        />
      </View>

      <Modal
        transparent
        visible={isCategorySheetOpen}
        animationType="fade"
        onRequestClose={closeCategorySheet}
      >
        <SafeAreaView edges={['bottom']} style={styles.screen}>
          <Pressable style={styles.sheetBackdrop} onPress={closeCategorySheet}>
            <Pressable style={styles.sheetCard} onPress={() => {}}>
              <Text style={styles.sheetTitle}>
                {strings.transactions.allCategoriesTitle}
              </Text>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.sheetList}
              >
                {allCategories.map(category => {
                  const isSelected = selectedCategory === category.id;
                  return (
                    <Pressable
                      key={category.id}
                      onPress={() => {
                        handleCategorySelect(category.id);
                        closeCategorySheet();
                      }}
                      style={[
                        styles.sheetCategoryRow,
                        isSelected && styles.sheetCategoryRowActive,
                      ]}
                    >
                      <Text style={styles.sheetCategoryEmoji}>
                        {category.emoji}
                      </Text>
                      <Text style={styles.sheetCategoryLabel}>
                        {resolveCategoryLabel(category)}
                      </Text>
                      {isSelected ? (
                        <Text style={[styles.sheetSelected, { color: accent }]}>
                          {strings.popup.okButton}
                        </Text>
                      ) : null}
                    </Pressable>
                  );
                })}

                <View style={styles.addCategoryCard}>
                  <Text style={styles.addCategoryTitle}>
                    {strings.transactions.addCategoryTitle}
                  </Text>
                  <Text style={styles.sheetInputLabel}>
                    {strings.transactions.categoryNameLabel}
                  </Text>
                  <TextInput
                    value={categoryName}
                    onChangeText={setCategoryName}
                    placeholder={strings.transactions.categoryNamePlaceholder}
                    placeholderTextColor={colors.muted}
                    style={styles.sheetInput}
                  />
                  <Text style={styles.sheetInputLabel}>
                    {strings.transactions.categoryEmojiLabel}
                  </Text>
                  <TextInput
                    value={categoryEmoji}
                    onChangeText={setCategoryEmoji}
                    placeholder={strings.transactions.categoryEmojiPlaceholder}
                    placeholderTextColor={colors.muted}
                    style={styles.sheetInput}
                    maxLength={4}
                  />
                  <Pressable
                    onPress={handleAddCategory}
                    style={[
                      styles.addCategoryButton,
                      { backgroundColor: accent },
                    ]}
                  >
                    <Text style={styles.addCategoryButtonText}>
                      {strings.transactions.addCategoryButton}
                    </Text>
                  </Pressable>
                </View>
              </ScrollView>
            </Pressable>
          </Pressable>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default AddTransactionScreen;
