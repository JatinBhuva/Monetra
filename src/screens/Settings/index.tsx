import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { PrimaryActionButton, TabHeader } from '../../components';
import { strings } from '../../utils/strings';
import { useSettings } from './Settings.hook';
import { getContentStyle, styles } from './styles';
import { spacing } from '../../theme';
import { useTabBarSpacing } from '../../hooks/useTabBarSpacing';

type SettingsRowProps = {
  label: string;
  value?: string;
  description?: string;
  icon?: string;
  onPress?: () => void;
  disabled?: boolean;
  isFirst?: boolean;
};

const SettingsRow = ({
  label,
  value,
  description,
  icon,
  onPress,
  disabled,
  isFirst,
}: SettingsRowProps) => {
  const content = (
    <View style={styles.rowContent}>
      {icon ? <Text style={styles.rowIcon}>{icon}</Text> : null}
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        {description ? (
          <Text style={styles.rowDescription}>{description}</Text>
        ) : null}
      </View>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
    </View>
  );

  if (!onPress) {
    return (
      <View style={[styles.row, isFirst && styles.rowFirst]}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.row,
        isFirst && styles.rowFirst,
        pressed && !disabled ? styles.rowPressed : null,
        disabled ? styles.rowDisabled : null,
      ]}
    >
      {content}
    </Pressable>
  );
};

const SettingsScreen = () => {
  const {
    clearStatus,
    handleClearDatabase,
    handleManageCategories,
    handleManageLanguage,
    handleExportData,
    handleImportData,
    handleBackupSync,
    handleQuickDate,
    handleRecurring,
    handleMultiCurrency,
    lastType,
    lastCategoryLabel,
    appVersion,
  } = useSettings();
  const tabBarSpacing = useTabBarSpacing(spacing.lg);
  const lastTypeLabel =
    lastType === 'expense'
      ? strings.settings.currentTypeExpense
      : lastType === 'income'
        ? strings.settings.currentTypeIncome
        : strings.settings.currentSelectionNone;
  const lastCategoryValue =
    lastCategoryLabel ?? strings.settings.currentSelectionNone;

  return (
    <View style={styles.container}>
      <TabHeader
        title={strings.settings.title}
        subtitle={strings.settings.subtitle}
      />
      <ScrollView
        contentContainerStyle={getContentStyle(tabBarSpacing)}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {strings.settings.currentSelectionTitle}
          </Text>
          <Text style={styles.sectionDescription}>
            {strings.settings.currentSelectionDescription}
          </Text>
          <SettingsRow
            label={strings.settings.currentCurrencyLabel}
            value={strings.transactions.currencySymbol}
            icon="💱"
            isFirst
          />
          <SettingsRow
            label={strings.settings.currentDateLocaleLabel}
            value={strings.transactions.dateLocale}
            icon="📅"
          />
          <SettingsRow
            label={strings.settings.currentTypeLabel}
            value={lastTypeLabel}
            icon="🧾"
          />
          <SettingsRow
            label={strings.settings.currentCategoryLabel}
            value={lastCategoryValue}
            icon="🏷️"
          />
          <SettingsRow
            label={strings.settings.currentLanguageLabel}
            value={strings.settings.languageValue}
            icon="🌍"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {strings.settings.manageCategoriesTitle}
          </Text>
          <Text style={styles.sectionDescription}>
            {strings.settings.manageCategoriesDescription}
          </Text>
          <PrimaryActionButton
            label={strings.settings.manageCategoriesAction}
            onPress={handleManageCategories}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{strings.settings.languageTitle}</Text>
          <Text style={styles.sectionDescription}>
            {strings.settings.languageDescription}
          </Text>
          <PrimaryActionButton
            label={strings.settings.languageAction}
            onPress={handleManageLanguage}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{strings.settings.dataTitle}</Text>
          <Text style={styles.sectionDescription}>
            {strings.settings.dataDescription}
          </Text>
          <SettingsRow
            label={strings.settings.exportDataAction}
            onPress={handleExportData}
            value={strings.popup.comingSoonTitle}
            icon="⬇️"
            isFirst
          />
          <SettingsRow
            label={strings.settings.importDataAction}
            onPress={handleImportData}
            value={strings.popup.comingSoonTitle}
            icon="⬆️"
          />
          <SettingsRow
            label={strings.settings.backupSyncAction}
            onPress={handleBackupSync}
            value={strings.popup.comingSoonTitle}
            icon="☁️"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {strings.settings.preferencesTitle}
          </Text>
          <Text style={styles.sectionDescription}>
            {strings.settings.preferencesDescription}
          </Text>
          <SettingsRow
            label={strings.settings.quickDateAction}
            onPress={handleQuickDate}
            value={strings.popup.comingSoonTitle}
            icon="⚡"
            isFirst
          />
          <SettingsRow
            label={strings.settings.recurringAction}
            onPress={handleRecurring}
            value={strings.popup.comingSoonTitle}
            icon="🔁"
          />
          <SettingsRow
            label={strings.settings.multiCurrencyAction}
            onPress={handleMultiCurrency}
            value={strings.popup.comingSoonTitle}
            icon="💱"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{strings.settings.aboutTitle}</Text>
          <Text style={styles.sectionDescription}>
            {strings.settings.aboutDescription}
          </Text>
          <SettingsRow
            label={strings.settings.appVersionLabel}
            value={appVersion}
            icon="ℹ️"
            isFirst
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {strings.settings.otherIdeasTitle}
          </Text>
          <Text style={styles.sectionDescription}>
            {strings.settings.otherIdeasDescription}
          </Text>
          <SettingsRow
            label={strings.settings.ideaBudgets}
            value={strings.popup.comingSoonTitle}
            icon="🎯"
            isFirst
          />
          <SettingsRow
            label={strings.settings.ideaRecurring}
            value={strings.popup.comingSoonTitle}
            icon="🗓️"
          />
          <SettingsRow
            label={strings.settings.ideaThemes}
            value={strings.popup.comingSoonTitle}
            icon="🎨"
          />
          <SettingsRow
            label={strings.settings.ideaSecurity}
            value={strings.popup.comingSoonTitle}
            icon="🔒"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{strings.settings.devToolsTitle}</Text>
          <Text style={styles.sectionDescription}>
            {strings.settings.devToolsDescription}
          </Text>
          <PrimaryActionButton
            label={strings.settings.clearDatabaseButton}
            onPress={handleClearDatabase}
            isLoading={clearStatus === 'loading'}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
