import React from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import { useAppTheme, useThemedStyles } from '../../theme';
import { strings } from '../../utils/strings';
import { useSettings } from './Settings.hook';
import { spacing } from '../../theme';
import { useTabBarSpacing } from '../../hooks/useTabBarSpacing';
import { createStyles } from './styles';

const MonetraLogo = ({ isDark }: { isDark: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 88 88" fill="none">
    <Circle cx={44} cy={44} r={44} fill="#35C759" />
    <Path
      d="M20 53L35.5 34.5L49 45.5L68 24"
      stroke={isDark ? '#E5ECF5' : '#0B0F14'}
      strokeWidth={5.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

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
  const { colors, isDark } = useAppTheme();
  const {
    handleLogout,
    handleAccountPreferences,
    handleManageCategories,
    handlePasswordSecurity,
    handleHelpCenter,
    email,
    isSigningOut,
    appVersion,
    isDarkTheme,
    toggleTheme,
  } = useSettings();
  const tabBarSpacing = useTabBarSpacing(spacing.lg);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: tabBarSpacing }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View style={styles.brandMark}>
              <MonetraLogo isDark={isDark} />
            </View>
            <Text style={styles.brandText}>Monetra</Text>
          </View>
          <View style={styles.topAvatar}>
            <Text style={styles.topAvatarIcon}>👤</Text>
          </View>
        </View>

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
              label={strings.settings.primaryCurrencyLabel}
              value={strings.settings.primaryCurrencyValue}
              description={strings.settings.primaryCurrencyDescription}
              icon="💱"
              onPress={handleAccountPreferences}
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
    </SafeAreaView>
  );
};

export default SettingsScreen;
