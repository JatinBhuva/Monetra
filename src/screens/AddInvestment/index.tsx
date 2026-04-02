import React from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CustomInput, PrimaryActionButton } from '../../components';
import { assets } from '../../assets';
import { useAppTheme, useThemedStyles } from '../../theme';
import type { Investment } from '../../types/investments';
import { strings } from '../../utils/strings';
import { useAddInvestment } from './AddInvestment.hook';
import { createStyles } from './styles';

type AddInvestmentScreenProps = {
  onClose?: () => void;
  investmentToEdit?: Investment;
};

const formatDate = (value: Date) =>
  value.toLocaleDateString(strings.transactions.dateLocale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const AddInvestmentScreen = ({
  onClose,
  investmentToEdit,
}: AddInvestmentScreenProps) => {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  const ArrowDownIcon = assets.icons.arrowDown;
  const {
    isEditing,
    entryMode,
    setEntryMode,
    assetName,
    setAssetName,
    amount,
    setAmount,
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
  } = useAddInvestment({
    investmentToEdit,
    onClose,
  });

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.segmentedControl}>
          <Pressable
            onPress={() => setEntryMode('add')}
            style={[styles.segment, entryMode === 'add' && styles.segmentActive]}
          >
            <Text style={[styles.segmentText, entryMode === 'add' && styles.segmentTextActive]}>
              {strings.investments.modeAdd}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setEntryMode('withdraw')}
            style={[styles.segment, entryMode === 'withdraw' && styles.segmentActive]}
          >
            <Text
              style={[
                styles.segmentText,
                entryMode === 'withdraw' && styles.segmentTextActive,
              ]}
            >
              {strings.investments.modeWithdraw}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.title}>
          {isEditing ? strings.investments.editTitle : strings.investments.newTitle}
        </Text>
        <Text style={styles.subtitle}>
          Specify the asset details for your curated ledger.
        </Text>

        <View style={styles.formSection}>
          <Text style={styles.label}>{strings.investments.assetNameLabel}</Text>
          <CustomInput
            value={assetName}
            onChangeText={setAssetName}
            placeholder={strings.investments.assetNamePlaceholder}
            containerStyle={styles.input}
            inputStyle={styles.inputText}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>{strings.investments.amountCurrencyLabel}</Text>
          <CustomInput
            value={amount}
            onChangeText={setAmount}
            onBlur={() => setAmountTouched(true)}
            placeholder={strings.investments.amountPlaceholder}
            keyboardType="numeric"
            containerStyle={styles.input}
            inputStyle={styles.inputText}
          />
          {isInvalidAmount ? (
            <Text style={styles.errorText}>{strings.investments.amountError}</Text>
          ) : null}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>{strings.investments.categoryDropdownLabel}</Text>
          <Pressable
            style={[styles.input, styles.dropdownInput]}
            onPress={() => setShowTypePicker(true)}
          >
            <Text style={styles.inputText}>{selectedTypeLabel}</Text>
            <ArrowDownIcon width={20} height={20} fill={colors.muted} />
          </Pressable>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>
            {strings.investments.transactionDateDisplayLabel}
          </Text>
          <Pressable
            style={[styles.input, styles.dropdownInput]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.calendarIcon}>📅</Text>
            <Text style={styles.inputText}>{formatDate(date)}</Text>
            <Text style={styles.dropdownIcon}>◻</Text>
          </Pressable>
        </View>

        <View style={styles.impactCard}>
          <View style={styles.impactHeader}>
            <View style={styles.impactIconWrap}>
              <Text style={styles.impactIcon}>↗</Text>
            </View>
            <View>
              <Text style={styles.impactTitle}>
                {strings.investments.impactTitle}
              </Text>
              <Text style={styles.impactSubtitle}>
                {strings.investments.impactSubtitle}
              </Text>
            </View>
          </View>
          <View style={styles.impactStatsRow}>
            <View style={styles.impactStatBox}>
              <Text style={styles.impactStatLabel}>
                {strings.investments.impactNewAllocationLabel}
              </Text>
              <Text style={styles.impactStatValue}>
                {strings.investments.impactNewAllocationValue}
              </Text>
            </View>
            <View style={styles.impactStatBox}>
              <Text style={styles.impactStatLabel}>
                {strings.investments.impactRiskAdjustedLabel}
              </Text>
              <Text style={styles.impactStatValue}>
                {strings.investments.impactRiskAdjustedValue}
              </Text>
            </View>
          </View>
          <Text style={styles.impactFootnote}>
            {strings.investments.impactFootnote}
          </Text>
        </View>

        <PrimaryActionButton
          label={
            isEditing
              ? strings.investments.saveChangesButton
              : strings.investments.addButton
          }
          onPress={handleSave}
          isLoading={isSaving}
          disabled={amountValue <= 0 || isSaving}
          backgroundColor={colors.success}
          style={styles.submitButton}
          textColor={colors.primaryContrast}
        />
      </ScrollView>

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

      <Modal
        transparent
        animationType="fade"
        visible={showTypePicker}
        onRequestClose={() => setShowTypePicker(false)}
      >
        <Pressable style={styles.typePickerBackdrop} onPress={() => setShowTypePicker(false)}>
          <Pressable style={styles.typePickerCard} onPress={() => {}}>
            {INVESTMENT_OPTIONS.map(option => (
              <Pressable
                key={option.value}
                style={styles.typePickerRow}
                onPress={() => {
                  setType(option.value);
                  setShowTypePicker(false);
                }}
              >
                <Text style={styles.typePickerRowText}>{option.label}</Text>
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default AddInvestmentScreen;
