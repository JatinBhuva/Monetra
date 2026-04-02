import React from 'react';
import { Modal, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { assets } from '../../assets';
import { ScreenHeader } from '../../components';
import { useAppTheme, useThemedStyles } from '../../theme';
import { strings } from '../../utils/strings';
import { useSettings } from './Settings.hook';
import { spacing } from '../../theme';
import { useTabBarSpacing } from '../../hooks/useTabBarSpacing';
import { createStyles } from './styles';

type SettingsRowProps = {
  label: string;
  value?: string;
  description?: string;
  icon: string;
  onPress?: () => void;
  rightControl?: React.ReactNode;
};

const SettingsRow = ({
  label,
  value,
  description,
  icon,
  onPress,
  rightControl,
}: SettingsRowProps) => {
  const styles = useThemedStyles(createStyles);
  const content = (
    <View style={styles.rowContent}>
      <View style={styles.rowIconWrap}>
        <Text style={styles.rowIcon}>{icon}</Text>
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        {description ? <Text style={styles.rowDescription}>{description}</Text> : null}
      </View>
      {rightControl ?? (
        <>
          {value ? <Text style={styles.rowValue}>{value}</Text> : null}
          {onPress ? <Text style={styles.rowChevron}>›</Text> : null}
        </>
      )}
    </View>
  );

  if (!onPress) {
    return <View style={styles.row}>{content}</View>;
  }

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
      {content}
    </Pressable>
  );
};

const SettingsScreen = () => {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  const SettingsIcon = assets.icons.settings;
  const {
    handleLogout,
    handleAccountPreferences,
    handleManageCategories,
    handleOpenProfile,
    handlePasswordSecurity,
    handleHelpCenter,
    email,
    isSigningOut,
    appVersion,
    isDarkTheme,
    toggleTheme,
    openCurrencyPicker,
    closeCurrencyPicker,
    selectCurrency,
    isCurrencyPickerOpen,
    currencyOptions,
    selectedCurrency,
  } = useSettings();
  const tabBarSpacing = useTabBarSpacing(spacing.lg);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.headerWrap}>
        <ScreenHeader
          title={strings.navigation.settings}
          icon={SettingsIcon}
        />
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: tabBarSpacing }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarIcon}>👤</Text>
          </View>
          <Text style={styles.profileEmail}>{email}</Text>
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>{strings.settings.appearanceTitle}</Text>
          <View style={styles.sectionCard}>
            <SettingsRow
              label={strings.settings.themeLabel}
              description={strings.settings.themeDescription}
              icon="🌗"
              value={isDarkTheme ? strings.settings.themeDark : strings.settings.themeLight}
              rightControl={
                <Switch
                  value={isDarkTheme}
                  onValueChange={() => {
                    toggleTheme().catch(() => {});
                  }}
                  trackColor={{
                    false: colors.border,
                    true: colors.successSoft,
                  }}
                  thumbColor={isDarkTheme ? colors.successBright : colors.surface}
                />
              }
            />
          </View>
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>{strings.settings.accountPreferencesTitle}</Text>
          <View style={styles.sectionCard}>
            <SettingsRow
              label={strings.settings.profileLabel}
              description={strings.settings.profileDescription}
              icon="👤"
              onPress={handleOpenProfile}
            />
            <SettingsRow
              label={strings.settings.primaryCurrencyLabel}
              value={`${selectedCurrency.code} (${selectedCurrency.symbol})`}
              description={strings.settings.primaryCurrencyDescription}
              icon="💱"
              onPress={openCurrencyPicker}
            />
            <SettingsRow
              label={strings.settings.languageLabel}
              value={strings.settings.languageValue}
              description={strings.settings.languageDescription}
              icon="🌐"
              onPress={handleAccountPreferences}
            />
            <SettingsRow
              label={strings.settings.manageCategoriesLabel}
              description={strings.settings.manageCategoriesDescription}
              icon="🗂️"
              onPress={handleManageCategories}
            />
          </View>
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>{strings.settings.securityTitle}</Text>
          <View style={styles.sectionCard}>
            <SettingsRow
              label={strings.settings.passwordSecurityLabel}
              value={strings.settings.passwordSecurityValue}
              description={strings.settings.passwordSecurityDescription}
              icon="🔒"
              onPress={handlePasswordSecurity}
            />
            <SettingsRow
              label={strings.settings.biometricLabel}
              description={strings.settings.biometricDescription}
              icon="🟢"
              rightControl={
                <Switch
                  disabled
                  value={false}
                  trackColor={{ false: colors.border, true: colors.successSoft }}
                  thumbColor={colors.surface}
                />
              }
            />
          </View>
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>{strings.settings.supportTitle}</Text>
          <View style={styles.sectionCard}>
            <SettingsRow
              label={strings.settings.helpCenterLabel}
              description={strings.settings.helpCenterDescription}
              icon="❔"
              onPress={handleHelpCenter}
            />
            <SettingsRow
              label={strings.settings.aboutLabel}
              description={`${strings.settings.aboutDescriptionPrefix} ${appVersion}`}
              icon="ℹ️"
            />
          </View>
        </View>

        <Pressable
          onPress={handleLogout}
          disabled={isSigningOut}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed ? styles.logoutPressed : null,
            isSigningOut ? styles.logoutDisabled : null,
          ]}
        >
          <Text style={styles.logoutText}>
            {isSigningOut ? strings.settings.loggingOutValue : strings.settings.logoutAction}
          </Text>
        </Pressable>
      </ScrollView>

      <Modal
        transparent
        animationType="fade"
        visible={isCurrencyPickerOpen}
        onRequestClose={closeCurrencyPicker}
      >
        <Pressable style={styles.modalBackdrop} onPress={closeCurrencyPicker}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>{strings.settings.primaryCurrencyLabel}</Text>
            <ScrollView
              style={styles.modalList}
              showsVerticalScrollIndicator={false}
            >
              {currencyOptions.map(item => {
                const isSelected = item.code === selectedCurrency.code;
                return (
                  <Pressable
                    key={item.code}
                    style={[styles.modalRow, isSelected ? styles.modalRowSelected : null]}
                    onPress={() => {
                      selectCurrency(item.code);
                    }}
                  >
                    <Text style={styles.modalRowLabel}>
                      {item.label} ({item.code})
                    </Text>
                    <Text style={styles.modalRowValue}>{item.symbol}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default SettingsScreen;
