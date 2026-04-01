import React, { useEffect, useMemo, useState } from 'react';
import {
  DeviceEventEmitter,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CustomInput, DateInput, PrimaryActionButton } from '../../components';
import { investmentRepository } from '../../data/repositories/investmentRepository';
import { useAppDispatch } from '../../store/hooks';
import { showPopup } from '../../store';
import { useAppTheme, useThemedStyles } from '../../theme';
import { INVESTMENT_TYPES, type InvestmentType } from '../../types/investments';
import { strings } from '../../utils/strings';
import { INVESTMENT_CREATED_EVENT } from '../../utils/events';
import { createStyles } from './styles';

type AddInvestmentScreenProps = {
  onClose?: () => void;
};

const formatDate = (value: Date) =>
  value.toLocaleDateString(strings.transactions.dateLocale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const parseAmount = (value: string) => {
  const normalized = value.replace(/,/g, '').trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const AddInvestmentScreen = ({ onClose }: AddInvestmentScreenProps) => {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  const dispatch = useAppDispatch();

  const [amount, setAmount] = useState('');
  const [type, setType] = useState<InvestmentType>('mutual_fund');
  const [date, setDate] = useState(new Date());
  const [policyNumber, setPolicyNumber] = useState('');
  const [policyStartDate, setPolicyStartDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [amountTouched, setAmountTouched] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPolicyDatePicker, setShowPolicyDatePicker] = useState(false);

  const isStockMarket = type === 'stock_market';
  const amountValue = useMemo(() => parseAmount(amount), [amount]);
  const showAmountError = amountTouched && amountValue <= 0;

  useEffect(() => {
    let isMounted = true;

    const loadLastPolicy = async () => {
      if (isStockMarket) {
        if (isMounted) {
          setPolicyNumber('');
        }
        return;
      }

      const policy = await investmentRepository.getLastPolicyByType(type);
      if (!isMounted) {
        return;
      }

      if (policy?.policyNumber) {
        setPolicyNumber(policy.policyNumber);
      } else {
        setPolicyNumber('');
      }

      if (policy?.policyStartDate) {
        const nextDate = new Date(policy.policyStartDate);
        if (!Number.isNaN(nextDate.getTime())) {
          setPolicyStartDate(nextDate);
        }
      }
    };

    loadLastPolicy().catch(() => {
      if (isMounted) {
        setPolicyNumber('');
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isStockMarket, type]);

  const submitDisabled = useMemo(
    () => isSaving || amountValue <= 0,
    [amountValue, isSaving],
  );

  const handleSave = async () => {
    setAmountTouched(true);
    if (submitDisabled) {
      return;
    }

    setIsSaving(true);

    try {
      await investmentRepository.create({
        id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
        amount: amountValue.toString(),
        type,
        date: date.toISOString(),
        policyNumber: isStockMarket ? null : policyNumber.trim() || null,
        policyStartDate: isStockMarket ? null : policyStartDate.toISOString(),
        note: note.trim(),
        createdAt: new Date().toISOString(),
      });

      dispatch(
        showPopup({
          title: strings.popup.investmentAddedTitle,
          message: strings.popup.investmentAddedMessage,
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

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.screen}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>{strings.investments.title}</Text>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeIcon}>{strings.transactions.closeIcon}</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formSection}>
          <CustomInput
            label={strings.investments.amountLabel}
            value={amount}
            onChangeText={setAmount}
            onBlur={() => setAmountTouched(true)}
            placeholder={strings.investments.amountPlaceholder}
            keyboardType="numeric"
            leadingText={strings.transactions.currencySymbol}
            containerStyle={styles.input}
            inputStyle={styles.inputText}
          />
          {showAmountError ? (
            <Text style={styles.errorText}>{strings.investments.amountError}</Text>
          ) : null}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>{strings.investments.typeLabel}</Text>
          <View style={styles.typeGrid}>
            {INVESTMENT_TYPES.map(item => {
              const isActive = type === item;
              return (
                <Pressable
                  key={item}
                  style={[styles.typeChip, isActive && styles.typeChipActive]}
                  onPress={() => setType(item)}
                >
                  <Text
                    style={[
                      styles.typeChipText,
                      isActive && styles.typeChipTextActive,
                    ]}
                  >
                    {strings.investments.typeNames[item]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.formSection}>
          <DateInput
            label={strings.investments.dateLabel}
            value={formatDate(date)}
            icon={strings.transactions.dateIcon}
            accentColor={colors.success}
            containerStyle={styles.input}
            inputStyle={styles.inputText}
            onPress={() => setShowDatePicker(true)}
          />
          {showDatePicker ? (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                if (Platform.OS === 'android') {
                  setShowDatePicker(false);
                }
                if (event.type === 'set' && selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          ) : null}
        </View>

        {!isStockMarket ? (
          <>
            <View style={styles.formSection}>
              <CustomInput
                label={strings.investments.policyNumberLabel}
                value={policyNumber}
                onChangeText={setPolicyNumber}
                placeholder={strings.investments.policyNumberPlaceholder}
                containerStyle={styles.input}
                inputStyle={styles.inputText}
              />
            </View>

            <View style={styles.formSection}>
              <DateInput
                label={strings.investments.policyStartDateLabel}
                value={formatDate(policyStartDate)}
                icon={strings.transactions.dateIcon}
                accentColor={colors.success}
                containerStyle={styles.input}
                inputStyle={styles.inputText}
                onPress={() => setShowPolicyDatePicker(true)}
              />
              {showPolicyDatePicker ? (
                <DateTimePicker
                  value={policyStartDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    if (Platform.OS === 'android') {
                      setShowPolicyDatePicker(false);
                    }
                    if (event.type === 'set' && selectedDate) {
                      setPolicyStartDate(selectedDate);
                    }
                  }}
                />
              ) : null}
              <Text style={styles.hintText}>{strings.investments.policyHint}</Text>
            </View>
          </>
        ) : (
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>{strings.investments.stockPolicyInfo}</Text>
          </View>
        )}

        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>{strings.investments.noteLabel}</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder={strings.investments.notePlaceholder}
            placeholderTextColor={colors.muted}
            multiline
            style={[styles.input, styles.notesInput, styles.inputText]}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryActionButton
          label={strings.investments.addButton}
          onPress={handleSave}
          isLoading={isSaving}
          disabled={submitDisabled}
          backgroundColor={colors.success}
          style={styles.submitButton}
        />
      </View>
    </SafeAreaView>
  );
};

export default AddInvestmentScreen;
