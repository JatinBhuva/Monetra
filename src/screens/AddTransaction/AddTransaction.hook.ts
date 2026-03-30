import { useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

import type { Category } from '../../types/categories';
import type { TransactionType } from '../../types/transactions';
import {
  addTransactionRequested,
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
  onClose?: () => void;
};

export const useAddTransaction = ({
  dateLocale,
  initialType,
  onClose,
}: UseAddTransactionProps) => {
  const [activeType] = useState<TransactionType>(initialType);
  const [focusedField, setFocusedField] = useState<null | string>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dispatch = useAppDispatch();
  const isSaving = useAppSelector(state => state.transactions.status === 'loading');
  const lastCreatedId = useAppSelector(state => state.transactions.lastCreatedId);
  const saveError = useAppSelector(state => state.transactions.error);
  const saveStatus = useAppSelector(state => state.transactions.status);
  const categories = useAppSelector(state => state.categories.items);
  const [localCategories, setLocalCategories] = useState<Category[]>([]);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
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
      id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
      type: activeType,
      amount: amount.trim(),
      description: description.trim(),
      categoryId: selectedCategory,
      date: selectedDate.toISOString(),
      category,
    };

    setSubmittedId(transaction.id);
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
  }, [activeType, mergedCategories, pendingCategoryId]);

  useEffect(() => {
    if (!submittedId || submittedId !== lastCreatedId) {
      return;
    }

    dispatch(
      showPopup({
        title: strings.popup.transactionAddedTitle,
        message: strings.popup.transactionAddedMessage,
        buttonLabel: strings.popup.okButton,
      }),
    );
    preferencesRepository.set('lastType', activeType);
    if (selectedCategory) {
      preferencesRepository.set('lastCategoryId', selectedCategory);
    }
    setAmount('');
    setDescription('');
    setSelectedCategory(null);
    setSelectedDate(new Date());
    setFocusedField(null);
    setSubmitAttempted(false);
    setTouchedAmount(false);
    setTouchedCategory(false);
    if (onClose) {
      onClose();
    }
    setSubmittedId(null);
  }, [
    activeType,
    dispatch,
    lastCreatedId,
    onClose,
    selectedCategory,
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
