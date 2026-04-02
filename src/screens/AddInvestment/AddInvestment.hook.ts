import { useMemo, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';

import { investmentRepository } from '../../data/repositories/investmentRepository';
import { showPopup } from '../../store';
import { useAppDispatch } from '../../store/hooks';
import type { Investment } from '../../types/investments';
import { INVESTMENT_CREATED_EVENT } from '../../utils/events';
import { strings } from '../../utils/strings';

type InvestmentType =
  | 'mutual_fund'
  | 'public_provident_fund'
  | 'stock_market'
  | 'life_insurance'
  | 'fixed_deposit';

const INVESTMENT_OPTIONS: { label: string; value: InvestmentType }[] = [
  {
    label: strings.investments.typeNames.mutual_fund,
    value: 'mutual_fund',
  },
  {
    label: strings.investments.typeNames.public_provident_fund,
    value: 'public_provident_fund',
  },
  {
    label: strings.investments.typeNames.stock_market,
    value: 'stock_market',
  },
  {
    label: strings.investments.typeNames.life_insurance,
    value: 'life_insurance',
  },
  {
    label: strings.investments.typeNames.fixed_deposit,
    value: 'fixed_deposit',
  },
];

const parseAmount = (value: string) => {
  const normalized = value.replace(/,/g, '').trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const useAddInvestment = ({
  investmentToEdit,
  onClose,
}: {
  investmentToEdit?: Investment;
  onClose?: () => void;
}) => {
  const dispatch = useAppDispatch();
  const isEditing = Boolean(investmentToEdit);

  const initialDate = useMemo(() => {
    if (investmentToEdit?.date) {
      const parsed = new Date(investmentToEdit.date);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    return new Date();
  }, [investmentToEdit?.date]);

  const [entryMode, setEntryMode] = useState<'add' | 'withdraw'>(
    investmentToEdit?.note?.toLowerCase().includes('withdraw') ? 'withdraw' : 'add',
  );
  const [assetName, setAssetName] = useState(investmentToEdit?.policyNumber ?? '');
  const [amount, setAmount] = useState(investmentToEdit?.amount ?? '');
  const [type, setType] = useState<InvestmentType>(
    investmentToEdit?.type ?? 'stock_market',
  );
  const [date, setDate] = useState(initialDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [amountTouched, setAmountTouched] = useState(false);

  const amountValue = useMemo(() => parseAmount(amount), [amount]);
  const isInvalidAmount = amountTouched && amountValue <= 0;
  const selectedTypeLabel = useMemo(
    () =>
      INVESTMENT_OPTIONS.find(item => item.value === type)?.label ??
      strings.investments.typeNames.stock_market,
    [type],
  );

  const handleSave = async () => {
    setAmountTouched(true);
    if (amountValue <= 0 || isSaving) {
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        id: investmentToEdit?.id ?? `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
        amount: amountValue.toString(),
        type,
        date: date.toISOString(),
        policyNumber: assetName.trim() || null,
        policyStartDate: date.toISOString(),
        note:
          entryMode === 'withdraw'
            ? strings.investments.entryNoteWithdraw
            : strings.investments.entryNoteAdd,
        createdAt: investmentToEdit?.createdAt ?? new Date().toISOString(),
      };

      if (isEditing) {
        await investmentRepository.update(payload);
      } else {
        await investmentRepository.create(payload);
      }

      dispatch(
        showPopup({
          title: isEditing
            ? strings.popup.investmentUpdatedTitle
            : strings.popup.investmentAddedTitle,
          message: isEditing
            ? strings.popup.investmentUpdatedMessage
            : strings.popup.investmentAddedMessage,
          buttonLabel: strings.popup.okButton,
        }),
      );
      DeviceEventEmitter.emit(INVESTMENT_CREATED_EVENT);
      onClose?.();
    } catch {
      dispatch(
        showPopup({
          title: strings.popup.investmentFailedTitle,
          message: strings.popup.investmentFailedMessage,
          buttonLabel: strings.popup.okButton,
        }),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isEditing,
    entryMode,
    setEntryMode,
    assetName,
    setAssetName,
    amount,
    setAmount,
    type,
    setType,
    date,
    setDate,
    showDatePicker,
    setShowDatePicker,
    showTypePicker,
    setShowTypePicker,
    isSaving,
    amountValue,
    isInvalidAmount,
    selectedTypeLabel,
    INVESTMENT_OPTIONS,
    handleSave,
    setAmountTouched,
  };
};
