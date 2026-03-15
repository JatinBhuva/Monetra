import { useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

import type { TransactionType } from '../../types/transactions';
import {
  addTransactionRequested,
  loadCategoriesRequested,
  showPopup,
} from '../../store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { strings } from '../../utils/strings';
import { preferencesRepository } from '../../data/repositories/preferencesRepository';

type UseAddTransactionProps = {
  dateLocale: string;
  onClose?: () => void;
};

export const useAddTransaction = ({
  dateLocale,
  onClose,
}: UseAddTransactionProps) => {
  const [activeType, setActiveType] = useState<TransactionType>('expense');
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
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touchedAmount, setTouchedAmount] = useState(false);
  const [touchedDescription, setTouchedDescription] = useState(false);
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

  const isSubmitDisabled = useMemo(() => {
    const hasAmount = Number(amount) > 0;
    const hasDescription = description.trim().length > 0;
    const hasCategory = Boolean(selectedCategory);

    return !(hasAmount && hasDescription && hasCategory) || isSaving;
  }, [amount, description, selectedCategory, isSaving]);

  const handleSubmit = async () => {
    setSubmitAttempted(true);
    if (isSubmitDisabled || !selectedCategory) {
      return;
    }

    const transaction = {
      id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
      type: activeType,
      amount: amount.trim(),
      description: description.trim(),
      categoryId: selectedCategory,
      date: selectedDate.toISOString(),
    };

    setSubmittedId(transaction.id);
    dispatch(addTransactionRequested(transaction));
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setTouchedCategory(true);
  };

  const handleAmountBlur = () => setTouchedAmount(true);
  const handleDescriptionBlur = () => setTouchedDescription(true);

  const showAmountError =
    (submitAttempted || touchedAmount) && Number(amount) <= 0;
  const showDescriptionError =
    (submitAttempted || touchedDescription) && description.trim().length === 0;
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
      const [lastType, lastCategory] = await Promise.all([
        preferencesRepository.get('lastType'),
        preferencesRepository.get('lastCategoryId'),
      ]);

      if (!isMounted) {
        return;
      }

      if (lastType === 'expense' || lastType === 'income') {
        setActiveType(lastType);
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
    if (!pendingCategoryId || categories.length === 0) {
      return;
    }

    const match = categories.find(category => category.id === pendingCategoryId);
    if (match) {
      setSelectedCategory(match.id);
    }
    setPendingCategoryId(null);
  }, [categories, pendingCategoryId]);

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
    setTouchedDescription(false);
    setTouchedCategory(false);
    if (onClose) {
      onClose();
    }
    setSubmittedId(null);
  }, [dispatch, lastCreatedId, onClose, submittedId]);

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

  return {
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
    setSelectedDate,
    showDatePicker,
    setShowDatePicker,
    formattedDate,
    categories,
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
  };
};
