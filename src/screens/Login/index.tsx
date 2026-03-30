import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import { useAuth } from '../../auth/AuthContext';
import { CustomInput, PrimaryActionButton } from '../../components';
import { useAppTheme, useThemedStyles } from '../../theme';
import { strings } from '../../utils/strings';
import { createStyles } from './styles';

const MonetraLogo = ({ isDark }: { isDark: boolean }) => (
  <Svg width={88} height={88} viewBox="0 0 88 88" fill="none">
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

const LoginScreen = () => {
  const styles = useThemedStyles(createStyles);
  const { colors, isDark } = useAppTheme();
  const { signIn } = useAuth();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAdminEmail = async (type: 'forgot' | 'create') => {
    const subject =
      type === 'forgot'
        ? strings.auth.forgotPasswordSubject
        : strings.auth.createAccountSubject;
    const body =
      type === 'forgot'
        ? strings.auth.forgotPasswordBody
        : strings.auth.createAccountBody;

    const mailtoUrl = `mailto:${
      strings.auth.adminEmail
    }?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      await Linking.openURL(mailtoUrl);
    } catch {
      setErrorMessage(strings.auth.emailFallbackMessage);
    }
  };

  const handleLogin = async () => {
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await signIn(userId, password);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : strings.auth.loginFailed,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.formCard}>
              <View style={styles.logoWrap}>
                <View style={styles.logoBadge}>
                  <MonetraLogo isDark={isDark} />
                </View>
              </View>

              <View style={styles.heroBlock}>
                <Text style={styles.title}>{strings.auth.title}</Text>
                <Text style={styles.subtitle}>{strings.auth.subtitle}</Text>
              </View>

              <CustomInput
                value={userId}
                onChangeText={setUserId}
                placeholder={strings.auth.userIdPlaceholder}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                containerStyle={styles.inputContainer}
                inputStyle={styles.input}
              />
              <CustomInput
                value={password}
                onChangeText={setPassword}
                placeholder={strings.auth.passwordPlaceholder}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                returnKeyType="done"
                containerStyle={styles.inputContainer}
                inputStyle={styles.input}
              />

              <View style={styles.supportRow}>
                <Pressable onPress={() => openAdminEmail('forgot')}>
                  <Text style={styles.supportLink}>
                    {strings.auth.forgotPassword}
                  </Text>
                </Pressable>
              </View>

              {errorMessage ? (
                <Text style={styles.errorMessage}>{errorMessage}</Text>
              ) : null}

              <PrimaryActionButton
                label={strings.auth.loginButton}
                onPress={handleLogin}
                isLoading={isSubmitting}
                style={styles.loginButton}
                backgroundColor={colors.primary}
              />

              <View style={styles.footerRow}>
                <Text style={styles.footerText}>
                  {strings.auth.createAccountPrompt}
                </Text>
                <Pressable onPress={() => openAdminEmail('create')}>
                  <Text style={styles.footerLink}>
                    {strings.auth.createAccountAction}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
