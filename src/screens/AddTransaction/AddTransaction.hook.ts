import { useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

import type { Category } from '../../types/categories';
import type { Transaction, TransactionType } from '../../types/transactions';
import {
  addTransactionRequested,
  updateTransactionRequested,
  addCategoryRequested,
  loadCategoriesRequested,
  showPopup,
} from '../../store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { strings } from '../../utils/strings';
import { preferencesRepository } from '../../data/repositories/preferencesRepository';

type UseAddTransactionProps = {
  dateLocale: string;
  initialType: TransactionType;
  existingTransaction?: Transaction;
  onClose?: () => void;
};

export const useAddTransaction = ({
  dateLocale,
  initialType,
  existingTransaction,
  onClose,
}: UseAddTransactionProps) => {
  const isEditing = Boolean(existingTransaction);
  const [activeType] = useState<TransactionType>(
    existingTransaction?.type ?? initialType,
  );
  const [focusedField, setFocusedField] = useState<null | string>(null);
  const [amount, setAmount] = useState(existingTransaction?.amount ?? '');
  const [description, setDescription] = useState(
    existingTransaction?.description ?? '',
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    existingTransaction?.categoryId ?? null,
  );
  const [selectedDate, setSelectedDate] = useState(() => {
    if (existingTransaction?.date) {
      const parsed = new Date(existingTransaction.date);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    return new Date();
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dispatch = useAppDispatch();
  const isSaving = useAppSelector(state => state.transactions.status === 'loading');
  const lastCreatedId = useAppSelector(state => state.transactions.lastCreatedId);
  const lastUpdatedId = useAppSelector(state => state.transactions.lastUpdatedId);
  const saveError = useAppSelector(state => state.transactions.error);
  const saveStatus = useAppSelector(state => state.transactions.status);
  const categories = useAppSelector(state => state.categories.items);
  const [localCategories, setLocalCategories] = useState<Category[]>([]);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [submittedMode, setSubmittedMode] = useState<'create' | 'update' | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touchedAmount, setTouchedAmount] = useState(false);
  const [touchedCategory, setTouchedCategory] = useState(false);
  const [pendingCategoryId, setPendingCategoryId] = useState<string | null>(null);

  const formattedDate = useMemo(
    () =>
      selectedDate.toLocaleDateString(dateLocale, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    [dateLocale, selectedDate],
  );

  const mergedCategories = useMemo(() => {
    const categoryMap = new Map<string, Category>();

    for (const category of categories) {
      categoryMap.set(category.id, category);
    }

    for (const category of localCategories) {
      if (!categoryMap.has(category.id)) {
        categoryMap.set(category.id, category);
      }
    }

    return Array.from(categoryMap.values());
  }, [categories, localCategories]);

  const isSubmitDisabled = useMemo(() => {
    const hasAmount = Number(amount) > 0;
    const hasCategory = Boolean(selectedCategory);

    return !(hasAmount && hasCategory) || isSaving;
  }, [amount, selectedCategory, isSaving]);

  const handleSubmit = async () => {
    setSubmitAttempted(true);
    if (isSubmitDisabled || !selectedCategory) {
      return;
    }

    const category = mergedCategories.find(item => item.id === selectedCategory);
    const transaction = {
      id: existingTransaction?.id ?? `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
      type: activeType,
      amount: amount.trim(),
      description: description.trim(),
      categoryId: selectedCategory,
      date: selectedDate.toISOString(),
      category,
    };

    setSubmittedId(transaction.id);
    if (isEditing) {
      setSubmittedMode('update');
      dispatch(updateTransactionRequested(transaction));
      return;
    }

    setSubmittedMode('create');
    dispatch(addTransactionRequested(transaction));
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setTouchedCategory(true);
  };

  const handleAmountBlur = () => setTouchedAmount(true);
  const handleDescriptionBlur = () => {};

  const showAmountError =
    (submitAttempted || touchedAmount) && Number(amount) <= 0;
  const showDescriptionError = false;
  const showCategoryError =
    (submitAttempted || touchedCategory) && !selectedCategory;

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(loadCategoriesRequested());
    }
  }, [categories.length, dispatch]);

  useEffect(() => {
    let isMounted = true;
    const loadPreferences = async () => {
      const [, lastCategory] = await Promise.all([
        preferencesRepository.get('lastType'),
        preferencesRepository.get('lastCategoryId'),
      ]);

      if (!isMounted) {
        return;
      }

      if (lastCategory) {
        setPendingCategoryId(lastCategory);
      }
    };

    loadPreferences();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isEditing) {
      return;
    }

    if (!pendingCategoryId || mergedCategories.length === 0) {
      return;
    }

    const match = mergedCategories.find(
      category =>
        category.id === pendingCategoryId && category.type === activeType,
    );
    if (match) {
      setSelectedCategory(match.id);
    }
    setPendingCategoryId(null);
  }, [activeType, isEditing, mergedCategories, pendingCategoryId]);

  useEffect(() => {
    const isCreateSuccess =
      submittedMode === 'create' && submittedId && submittedId === lastCreatedId;
    const isUpdateSuccess =
      submittedMode === 'update' && submittedId && submittedId === lastUpdatedId;

    if (!isCreateSuccess && !isUpdateSuccess) {
      return;
    }

    dispatch(
      showPopup({
        title:
          submittedMode === 'update'
            ? strings.popup.transactionUpdatedTitle
            : strings.popup.transactionAddedTitle,
        message:
          submittedMode === 'update'
            ? strings.popup.transactionUpdatedMessage
            : strings.popup.transactionAddedMessage,
        buttonLabel: strings.popup.okButton,
      }),
    );
    preferencesRepository.set('lastType', activeType);
    if (selectedCategory) {
      preferencesRepository.set('lastCategoryId', selectedCategory);
    }
    if (!isEditing) {
      setAmount('');
      setDescription('');
      setSelectedCategory(null);
      setSelectedDate(new Date());
      setFocusedField(null);
      setSubmitAttempted(false);
      setTouchedAmount(false);
      setTouchedCategory(false);
    }
    if (onClose) {
      onClose();
    }
    setSubmittedId(null);
    setSubmittedMode(null);
  }, [
    activeType,
    dispatch,
    isEditing,
    lastCreatedId,
    lastUpdatedId,
    onClose,
    selectedCategory,
    submittedMode,
    submittedId,
  ]);

  useEffect(() => {
    if (saveStatus !== 'failed' || !submittedId) {
      return;
    }

    dispatch(
      showPopup({
        title: strings.popup.transactionFailedTitle,
        message: saveError ?? strings.popup.transactionFailedMessage,
        buttonLabel: strings.popup.okButton,
      }),
    );
    setSubmittedId(null);
  }, [dispatch, saveError, saveStatus, submittedId]);

  const handleDateChange = (event: { type: string }, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (event.type === 'set' && date) {
      setSelectedDate(date);
    }
  };

  const addCustomCategory = (name: string, emoji: string) => {
    const trimmedName = name.trim();
    const trimmedEmoji = emoji.trim() || '✨';

    if (!trimmedName) {
      return null;
    }

    const category: Category = {
      id: `custom-${activeType}-${Date.now()}`,
      type: activeType,
      name: trimmedName,
      emoji: trimmedEmoji,
      isDefault: false,
      labelKey: null,
      createdAt: new Date().toISOString(),
    };

    setLocalCategories(current => [category, ...current]);
    setSelectedCategory(category.id);
    setTouchedCategory(true);
    dispatch(addCategoryRequested(category));

    return category;
  };

  return {
    isEditing,
    activeType,
    focusedField,
    setFocusedField,
    amount,
    setAmount,
    description,
    setDescription,
    selectedCategory,
    setSelectedCategory,
    selectedDate,
    setSelectedDate,
    showDatePicker,
    setShowDatePicker,
    formattedDate,
    categories: mergedCategories,
    isSubmitDisabled,
    isSaving,
    showAmountError,
    showDescriptionError,
    showCategoryError,
    handleCategorySelect,
    handleAmountBlur,
    handleDescriptionBlur,
    handleDateChange,
    handleSubmit,
    addCustomCategory,
  };
};
