import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  View,
} from 'react-native';

import { useAuth } from '../../auth/AuthContext';
import { CustomInput, PrimaryActionButton } from '../../components';
import { strings } from '../../utils/strings';
import { styles } from './styles';

const LoginScreen = () => {
  const { signIn } = useAuth();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        <View style={styles.container}>
          <View style={styles.heroCard}>
            <Text style={styles.kicker}>{strings.auth.kicker}</Text>
            <Text style={styles.title}>{strings.auth.title}</Text>
            <Text style={styles.subtitle}>{strings.auth.subtitle}</Text>
          </View>

          <View style={styles.formCard}>
            <CustomInput
              label={strings.auth.userIdLabel}
              value={userId}
              onChangeText={setUserId}
              placeholder={strings.auth.userIdPlaceholder}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
            <CustomInput
              label={strings.auth.passwordLabel}
              value={password}
              onChangeText={setPassword}
              placeholder={strings.auth.passwordPlaceholder}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              returnKeyType="done"
            />
            {errorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null}
            <PrimaryActionButton
              label={strings.auth.loginButton}
              onPress={handleLogin}
              isLoading={isSubmitting}
            />
            <Text style={styles.helperText}>{strings.auth.demoHint}</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
