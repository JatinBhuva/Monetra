import { useMemo, useState } from 'react';
import { Platform } from 'react-native';

export type TransactionType = 'expense' | 'income';

type UseAddTransactionProps = {
  dateLocale: string;
};

export const useAddTransaction = ({ dateLocale }: UseAddTransactionProps) => {
  const [activeType, setActiveType] = useState<TransactionType>('expense');
  const [focusedField, setFocusedField] = useState<null | string>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

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
    const hasAmount = amount.trim().length > 0;
    const hasDescription = description.trim().length > 0;
    const hasCategory = Boolean(selectedCategory);

    return !(hasAmount && hasDescription && hasCategory);
  }, [amount, description, selectedCategory]);

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
    isSubmitDisabled,
    handleDateChange,
  };
};
