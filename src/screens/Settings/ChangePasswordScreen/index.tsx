import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackTitleHeader, PrimaryActionButton } from '../../../components';
import { useAppTheme, useThemedStyles } from '../../../theme';
import { strings } from '../../../utils/strings';
import { useChangePasswordScreen } from './ChangePasswordScreen.hook';
import { createStyles } from './styles';

type ChangePasswordScreenProps = {
  onBack?: () => void;
};

const getStrength = (value: string) => {
  if (value.length === 0) {
    return 0;
  }

  let score = 0;

  if (value.length >= 8) {
    score += 1;
  }

  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) {
    score += 1;
  }

  if (/\d/.test(value)) {
    score += 1;
  }

  if (/[^A-Za-z0-9]/.test(value)) {
    score += 1;
  }

  return Math.min(score, 4);
};

const ChangePasswordScreen = ({ onBack }: ChangePasswordScreenProps) => {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    currentPassword,
    newPassword,
    confirmPassword,
    accountPasswordError,
    isSavingAccountPassword,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    updateAccountPassword,
  } = useChangePasswordScreen(onBack);

  const strength = useMemo(() => getStrength(newPassword), [newPassword]);

  const strengthText =
    strength <= 1
      ? strings.settings.accountPasswordStrengthWeak
      : strength <= 3
      ? strings.settings.accountPasswordStrengthMedium
      : strings.settings.accountPasswordStrengthStrong;

  const strengthColor =
    strength <= 1 ? colors.error : strength <= 3 ? colors.accentBlue : colors.successBright;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={styles.headerWrap}>
        <BackTitleHeader
          title={strings.settings.accountPasswordModalTitle}
          onBack={onBack}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>{strings.settings.accountPasswordModalSubtitle}</Text>

        <View style={styles.formWrap}>
          <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>{strings.settings.accountPasswordCurrentLabel}</Text>
            <View style={styles.inputBox}>
              <TextInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                style={styles.input}
                placeholder={strings.settings.accountPasswordCurrentPlaceholder}
                placeholderTextColor={colors.muted}
                secureTextEntry={!showCurrent}
                autoCapitalize="none"
              />
              <Pressable
                onPress={() => setShowCurrent(prev => !prev)}
                style={({ pressed }) => [styles.eyeButton, pressed ? styles.eyeButtonPressed : null]}
              >
                <Text style={styles.eyeText}>{showCurrent ? '🙈' : '👁️'}</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>{strings.settings.accountPasswordNewLabel}</Text>
            <View style={styles.inputBox}>
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                style={styles.input}
                placeholder={strings.settings.accountPasswordNewPlaceholder}
                placeholderTextColor={colors.muted}
                secureTextEntry={!showNew}
                autoCapitalize="none"
              />
              <Pressable
                onPress={() => setShowNew(prev => !prev)}
                style={({ pressed }) => [styles.eyeButton, pressed ? styles.eyeButtonPressed : null]}
              >
                <Text style={styles.eyeText}>{showNew ? '🙈' : '👁️'}</Text>
              </Pressable>
            </View>

            <View style={styles.strengthHeader}>
              <Text style={styles.strengthLabel}>{strings.settings.accountPasswordStrengthLabel}</Text>
              <Text style={[styles.strengthValue, { color: strengthColor }]}>{strengthText}</Text>
            </View>
            <View style={styles.strengthBars}>
              {[0, 1, 2, 3].map(index => (
                <View
                  key={`strength-${index + 1}`}
                  style={[
                    styles.strengthBar,
                    index < strength
                      ? { backgroundColor: strengthColor }
                      : null,
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>{strings.settings.accountPasswordConfirmLabel}</Text>
            <View style={styles.inputBox}>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
                placeholder={strings.settings.accountPasswordConfirmPlaceholder}
                placeholderTextColor={colors.muted}
                secureTextEntry={!showConfirm}
                autoCapitalize="none"
              />
              <Pressable
                onPress={() => setShowConfirm(prev => !prev)}
                style={({ pressed }) => [styles.eyeButton, pressed ? styles.eyeButtonPressed : null]}
              >
                <Text style={styles.eyeText}>{showConfirm ? '🙈' : '👁️'}</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.hintCard}>
            <View style={styles.hintIconWrap}>
              <Text style={styles.hintIcon}>✅</Text>
            </View>
            <View style={styles.hintBody}>
              <Text style={styles.hintTitle}>{strings.settings.accountPasswordHintMinTitle}</Text>
              <Text style={styles.hintDescription}>
                {strings.settings.accountPasswordHintMinDescription}
              </Text>
            </View>
          </View>

          <View style={styles.hintCard}>
            <View style={styles.hintIconWrap}>
              <Text style={styles.hintIcon}>🛡️</Text>
            </View>
            <View style={styles.hintBody}>
              <Text style={styles.hintTitle}>{strings.settings.accountPasswordHintUniqueTitle}</Text>
              <Text style={styles.hintDescription}>
                {strings.settings.accountPasswordHintUniqueDescription}
              </Text>
            </View>
          </View>

          {accountPasswordError ? <Text style={styles.errorText}>{accountPasswordError}</Text> : null}
        </View>

        <View style={styles.ctaWrap}>
          <PrimaryActionButton
            label={strings.settings.accountPasswordUpdateAction}
            onPress={() => {
              updateAccountPassword().catch(() => {});
            }}
            isLoading={isSavingAccountPassword}
            style={styles.ctaButton}
            textStyle={styles.ctaText}
            backgroundColor={colors.successBright}
          />
          <Text style={styles.changedText}>{strings.settings.accountPasswordLastChangedLabel}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;
