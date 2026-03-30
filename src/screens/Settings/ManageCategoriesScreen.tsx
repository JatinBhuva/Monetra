import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CustomInput, PrimaryActionButton } from '../../components';
import { categoryRepository } from '../../data/repositories/categoryRepository';
import {
  addCategoryRequested,
  loadCategoriesRequested,
  removeCategoryRequested,
  showPopup,
} from '../../store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useAppTheme, useThemedStyles } from '../../theme';
import type { Category, CategoryType } from '../../types/categories';
import { resolveCategoryLabel } from '../../utils/categoryLabel';
import { strings } from '../../utils/strings';
import { createStyles } from './manageCategories.styles';

type ManageCategoriesScreenProps = {
  onBack?: () => void;
};

const ManageCategoriesScreen = ({ onBack }: ManageCategoriesScreenProps) => {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  const dispatch = useAppDispatch();
  const scrollRef = useRef<ScrollView>(null);
  const { items, status } = useAppSelector(state => state.categories);
  const [activeType, setActiveType] = useState<CategoryType>('expense');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const [draftEmoji, setDraftEmoji] = useState('✨');
  const [draftType, setDraftType] = useState<CategoryType>('expense');
  const [usageCounts, setUsageCounts] = useState<Record<string, number>>({});
  const [isUsageLoading, setIsUsageLoading] = useState(false);

  useEffect(() => {
    dispatch(loadCategoriesRequested());
  }, [dispatch]);

  useEffect(() => {
    let isMounted = true;

    const loadUsageCounts = async () => {
      setIsUsageLoading(true);

      try {
        const counts = await categoryRepository.getUsageCounts();
        if (isMounted) {
          setUsageCounts(counts);
        }
      } finally {
        if (isMounted) {
          setIsUsageLoading(false);
        }
      }
    };

    loadUsageCounts();

    return () => {
      isMounted = false;
    };
  }, [items]);

  const filteredCategories = useMemo(
    () => items.filter(item => item.type === activeType),
    [activeType, items],
  );

  const editingCategory = useMemo(
    () => items.find(item => item.id === editingCategoryId) ?? null,
    [editingCategoryId, items],
  );

  const resetForm = (nextType: CategoryType = activeType) => {
    setEditingCategoryId(null);
    setDraftName('');
    setDraftEmoji('✨');
    setDraftType(nextType);
  };

  const beginEdit = (category: Category) => {
    setEditingCategoryId(category.id);
    setDraftName(resolveCategoryLabel(category));
    setDraftEmoji(category.emoji);
    setDraftType(category.type);
    setActiveType(category.type);
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    });
  };

  const showValidationMessage = (message: string) => {
    dispatch(
      showPopup({
        title: strings.popup.comingSoonTitle,
        message,
        buttonLabel: strings.popup.okButton,
      }),
    );
  };

  const handleSave = () => {
    const normalizedName = draftName.trim();
    const normalizedEmoji = draftEmoji.trim() || '✨';

    if (!normalizedName) {
      showValidationMessage(strings.settings.manageCategoriesNameError);
      return;
    }

    const nextCategory: Category = {
      id: editingCategory?.id ?? `custom-${draftType}-${Date.now()}`,
      type: draftType,
      name: normalizedName,
      emoji: normalizedEmoji,
      isDefault: editingCategory?.isDefault ?? false,
      labelKey:
        editingCategory &&
        editingCategory.type === draftType &&
        resolveCategoryLabel(editingCategory) === normalizedName &&
        editingCategory.emoji === normalizedEmoji
          ? editingCategory.labelKey ?? null
          : null,
      createdAt: editingCategory?.createdAt ?? new Date().toISOString(),
    };

    dispatch(addCategoryRequested(nextCategory));
    setActiveType(draftType);
    resetForm(draftType);
  };

  const handleDelete = (category: Category) => {
    Alert.alert(
      strings.settings.manageCategoriesDeleteTitle,
      strings.settings.manageCategoriesDeleteMessage.replace(
        '{category}',
        resolveCategoryLabel(category),
      ),
      [
        { text: strings.settings.manageCategoriesDeleteCancel, style: 'cancel' },
        {
          text: strings.settings.manageCategoriesDeleteConfirm,
          style: 'destructive',
          onPress: () => {
            dispatch(removeCategoryRequested(category.id));
            if (editingCategoryId === category.id) {
              resetForm(activeType);
            }
          },
        },
      ],
    );
  };

  const formTitle = editingCategory
    ? strings.settings.manageCategoriesEditTitle
    : strings.settings.manageCategoriesAddTitle;

  const isBusy = status === 'loading' && items.length === 0;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
          >
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>
            {strings.settings.manageCategoriesScreenTitle}
          </Text>
        </View>

        <View style={styles.segmentedControl}>
          {(['expense', 'income'] as CategoryType[]).map(type => {
            const isActive = activeType === type;
            return (
              <Pressable
                key={type}
                onPress={() => {
                  setActiveType(type);
                  if (!editingCategory) {
                    setDraftType(type);
                  }
                }}
                style={[
                  styles.segment,
                  isActive && styles.segmentActive,
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    isActive && styles.segmentTextActive,
                  ]}
                >
                  {type === 'expense'
                    ? strings.transactions.expense
                    : strings.transactions.income}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>{formTitle}</Text>
            {editingCategory ? (
              <Pressable onPress={() => resetForm(activeType)}>
                <Text style={styles.cancelEditText}>
                  {strings.settings.manageCategoriesCancelEdit}
                </Text>
              </Pressable>
            ) : null}
          </View>

          <View style={styles.formTypeRow}>
            {(['expense', 'income'] as CategoryType[]).map(type => {
              const isActive = draftType === type;
              return (
                <Pressable
                  key={type}
                  onPress={() => setDraftType(type)}
                  style={[
                    styles.formTypeChip,
                    isActive && styles.formTypeChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.formTypeChipText,
                      isActive && styles.formTypeChipTextActive,
                    ]}
                  >
                    {type === 'expense'
                      ? strings.transactions.expense
                      : strings.transactions.income}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <CustomInput
            label={strings.transactions.categoryNameLabel}
            value={draftName}
            onChangeText={setDraftName}
            placeholder={strings.transactions.categoryNamePlaceholder}
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
          />

          <CustomInput
            label={strings.transactions.categoryEmojiLabel}
            value={draftEmoji}
            onChangeText={setDraftEmoji}
            placeholder={strings.transactions.categoryEmojiPlaceholder}
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
            maxLength={2}
          />

          <PrimaryActionButton
            label={
              editingCategory
                ? strings.settings.manageCategoriesSaveChanges
                : strings.settings.manageCategoriesAddButton
            }
            onPress={handleSave}
            backgroundColor={colors.success}
            style={styles.saveButton}
          />
        </View>

        <View style={styles.listSectionHeader}>
          <Text style={styles.listSectionTitle}>
            {strings.settings.manageCategoriesListTitle}
          </Text>
          {isUsageLoading ? (
            <ActivityIndicator size="small" color={colors.success} />
          ) : null}
        </View>

        {isBusy ? (
          <View style={styles.loaderCard}>
            <ActivityIndicator size="large" color={colors.success} />
          </View>
        ) : filteredCategories.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              {strings.settings.manageCategoriesEmptyTitle}
            </Text>
            <Text style={styles.emptyMessage}>
              {strings.settings.manageCategoriesEmptyMessage}
            </Text>
          </View>
        ) : (
          filteredCategories.map(category => {
            const usageCount = usageCounts[category.id] ?? 0;
            const canDelete = usageCount === 0;

            return (
              <View key={category.id} style={styles.categoryCard}>
                <View style={styles.categoryIconWrap}>
                  <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                </View>

                <View style={styles.categoryMain}>
                  <Text style={styles.categoryTitle}>
                    {resolveCategoryLabel(category)}
                  </Text>
                  <Text style={styles.categoryMeta}>
                    {canDelete
                      ? strings.settings.manageCategoriesUnusedMeta
                      : strings.settings.manageCategoriesUsedMeta.replace(
                          '{count}',
                          String(usageCount),
                        )}
                  </Text>
                </View>

                <View style={styles.categoryActions}>
                  <Pressable
                    onPress={() => beginEdit(category)}
                    style={({ pressed }) => [
                      styles.actionChip,
                      pressed && styles.actionChipPressed,
                    ]}
                  >
                    <Text style={styles.actionChipText}>
                      {strings.settings.manageCategoriesEditAction}
                    </Text>
                  </Pressable>

                  {canDelete ? (
                    <Pressable
                      onPress={() => handleDelete(category)}
                      style={({ pressed }) => [
                        styles.deleteChip,
                        pressed && styles.actionChipPressed,
                      ]}
                    >
                      <Text style={styles.deleteChipText}>
                        {strings.settings.manageCategoriesDeleteAction}
                      </Text>
                    </Pressable>
                  ) : null}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ManageCategoriesScreen;
