import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
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
  const [isComposerVisible, setIsComposerVisible] = useState(false);
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
    setIsComposerVisible(true);
  };

  const beginAdd = () => {
    resetForm(activeType);
    setIsComposerVisible(true);
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
    const nextType = editingCategory?.type ?? draftType;

    if (!normalizedName) {
      showValidationMessage(strings.settings.manageCategoriesNameError);
      return;
    }

    const nextCategory: Category = {
      id: editingCategory?.id ?? `custom-${nextType}-${Date.now()}`,
      type: nextType,
      name: normalizedName,
      emoji: normalizedEmoji,
      isDefault: editingCategory?.isDefault ?? false,
      labelKey:
        editingCategory &&
        editingCategory.type === nextType &&
        resolveCategoryLabel(editingCategory) === normalizedName &&
        editingCategory.emoji === normalizedEmoji
          ? editingCategory.labelKey ?? null
          : null,
      createdAt: editingCategory?.createdAt ?? new Date().toISOString(),
    };

    dispatch(addCategoryRequested(nextCategory));
    setActiveType(draftType);
    resetForm(draftType);
    setIsComposerVisible(false);
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

  const isBusy = status === 'loading' && items.length === 0;
  const totalCount = filteredCategories.length;
  const editingCategoryUsageCount = editingCategory
    ? usageCounts[editingCategory.id] ?? 0
    : 0;
  const canDeleteEditingCategory = editingCategoryUsageCount === 0;

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
          {[
            {
              key: 'expense',
              label: strings.transactions.expense,
            },
            {
              key: 'income',
              label: strings.transactions.income,
            },
            {
              key: 'investment',
              label: strings.analysisScreen.investmentsTitle,
            },
          ].map(tab => {
            const isActive = activeType === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => {
                  setActiveType(tab.key as CategoryType);
                  if (!editingCategory) {
                    setDraftType(tab.key as CategoryType);
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
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={beginAdd}
          style={({ pressed }) => [
            styles.addCategoryCard,
            pressed && styles.addCategoryCardPressed,
          ]}
        >
          <View style={styles.addCategoryGlow} />
          <View style={styles.addCategoryIconWrap}>
            <Text style={styles.addCategoryIcon}>＋</Text>
          </View>
          <View style={styles.addCategoryContent}>
            <Text style={styles.addCategoryTitle}>{strings.settings.manageCategoriesAddButton}</Text>
            <Text style={styles.addCategorySubtitle}>
              Organize your vault with custom labels
            </Text>
          </View>
          <Text style={styles.addCategoryArrow}>›</Text>
        </Pressable>

        <View style={styles.listSectionHeader}>
          <Text style={styles.listSectionTitle}>
            ACTIVE CATEGORIES
          </Text>
          {isUsageLoading ? (
            <ActivityIndicator size="small" color={colors.success} />
          ) : (
            <Text style={styles.listSectionCount}>{totalCount} Total</Text>
          )}
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

                <Pressable
                  onPress={() => beginEdit(category)}
                  style={({ pressed }) => [
                    styles.editIconButton,
                    pressed && styles.actionChipPressed,
                  ]}
                >
                  <Text style={styles.editIcon}>✎</Text>
                </Pressable>
              </View>
            );
          })
        )}
      </ScrollView>

      <Modal
        transparent
        animationType="slide"
        visible={isComposerVisible}
        onRequestClose={() => {
          setIsComposerVisible(false);
          resetForm(activeType);
        }}
      >
        <SafeAreaView edges={['top']} style={styles.composerScreen}>
          <ScrollView
            contentContainerStyle={styles.composerContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.composerHeader}>
              <Pressable
                onPress={() => {
                  setIsComposerVisible(false);
                  resetForm(activeType);
                }}
                style={({ pressed }) => [
                  styles.backButton,
                  pressed && styles.backButtonPressed,
                ]}
              >
                <Text style={styles.backIcon}>‹</Text>
              </Pressable>
              <Text style={styles.composerTitle}>
                {strings.settings.manageCategoriesScreenTitle}
              </Text>
            </View>

            <View style={styles.previewWrap}>
              <View style={styles.previewCircle}>
                <Text style={styles.previewEmoji}>{draftEmoji || '✨'}</Text>
              </View>
              <View style={styles.previewEditBadge}>
                <Text style={styles.previewEditIcon}>✎</Text>
              </View>
              <Text style={styles.previewLabel}>PREVIEW ICON</Text>
            </View>

            <Text style={styles.sectionLabel}>CATEGORY NAME</Text>
            <CustomInput
              value={draftName}
              onChangeText={setDraftName}
              placeholder="e.g. Shopping, Rent, Dividends"
              containerStyle={styles.composerInputContainer}
              inputStyle={styles.input}
            />

            <Text style={styles.sectionLabel}>TRANSACTION TYPE</Text>
            <View style={styles.formTypeRow}>
              {[
                { key: 'expense', label: strings.transactions.expense },
                { key: 'income', label: strings.transactions.income },
                { key: 'investment', label: strings.analysisScreen.investmentsTitle },
              ].map(tab => {
                const isActive = draftType === tab.key;
                const isDisabled = Boolean(editingCategory);
                return (
                  <Pressable
                    key={tab.key}
                    disabled={isDisabled}
                    onPress={() => {
                      if (isDisabled) {
                        return;
                      }
                      setDraftType(tab.key as CategoryType);
                    }}
                    style={[
                      styles.formTypeChip,
                      isActive && styles.formTypeChipActive,
                      isDisabled && !isActive && styles.formTypeChipDisabled,
                    ]}
                  >
                    <Text
                      style={[
                        styles.formTypeChipText,
                        isActive && styles.formTypeChipTextActive,
                        isDisabled && !isActive && styles.formTypeChipTextDisabled,
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <CustomInput
              label="SELECT ICON"
              value={draftEmoji}
              onChangeText={setDraftEmoji}
              placeholder={strings.transactions.categoryEmojiPlaceholder}
              containerStyle={styles.composerInputContainer}
              inputStyle={styles.input}
              maxLength={2}
            />

            <View style={styles.formActions}>
              {editingCategory && canDeleteEditingCategory ? (
                <Pressable
                  onPress={() => handleDelete(editingCategory)}
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
              {editingCategory && !canDeleteEditingCategory ? (
                <Text style={styles.deleteBlockedText}>
                  {strings.settings.manageCategoriesUsedMeta.replace(
                    '{count}',
                    String(editingCategoryUsageCount),
                  )}
                </Text>
              ) : null}
              <PrimaryActionButton
                label={
                  editingCategory
                    ? strings.settings.manageCategoriesSaveChanges
                    : 'Save Category'
                }
                onPress={handleSave}
                backgroundColor={colors.success}
                style={styles.saveButton}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default ManageCategoriesScreen;
