import { useEffect, useMemo, useState } from 'react';
import { Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '../../auth/AuthContext';
import { preferencesRepository } from '../../data/repositories/preferencesRepository';
import packageJson from '../../../package.json';
import { showPopup } from '../../store';
import { useAppDispatch } from '../../store/hooks';
import { useAppTheme } from '../../theme';
import { useCurrencyPreference } from '../../hooks/useCurrencyPreference';
import type { LoggedInStackParamList } from '../../types';
import { ScreenConstants } from '../../utils/constants';
import { PREFERENCE_KEYS } from '../../utils/preferencesKeys';
import { strings } from '../../utils/strings';

export const useSettings = () => {
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<LoggedInStackParamList>>();
  const { session, signOut } = useAuth();
  const { isDark, toggleTheme } = useAppTheme();
  const {
    selectedCurrency,
    currencyOptions,
    updateCurrencyCode,
  } = useCurrencyPreference();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isCurrencyPickerOpen, setIsCurrencyPickerOpen] = useState(false);
  const [profileDisplayIdentity, setProfileDisplayIdentity] = useState('');

  const showComingSoon = (message: string) => {
    dispatch(
      showPopup({
        title: strings.popup.comingSoonTitle,
        message,
        buttonLabel: strings.popup.okButton,
      }),
    );
  };

  const openSupportEmail = async () => {
    const email = strings.auth.adminEmail;
    const subject = encodeURIComponent(strings.settings.helpCenterSubject);
    const body = encodeURIComponent(strings.settings.helpCenterBody);
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;

    try {
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      if (!canOpen) {
        throw new Error('Mail app unavailable');
      }
      await Linking.openURL(mailtoUrl);
    } catch {
      dispatch(
        showPopup({
          title: strings.popup.comingSoonTitle,
          message: strings.settings.helpFallbackMessage,
          buttonLabel: strings.popup.okButton,
        }),
      );
    }
  };

  const handleLogout = async () => {
    setIsSigningOut(true);

    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };
  const email = useMemo(() => {
    if (session?.email?.trim()) {
      return session.email.trim();
    }

    if (!session?.userId || session.userId === strings.settings.currentSelectionNone) {
      return '';
    }

    return `${session.userId}@monetra.app`;
  }, [session?.email, session?.userId]);

  useEffect(() => {
    let isMounted = true;

    const loadIdentity = async () => {
      const [savedName, savedEmail] = await Promise.all([
        preferencesRepository.get(PREFERENCE_KEYS.PROFILE_FULL_NAME),
        preferencesRepository.get(PREFERENCE_KEYS.PROFILE_EMAIL),
      ]);

      const nextIdentity =
        (savedName ?? '').trim() ||
        (savedEmail ?? '').trim() ||
        email;

      if (isMounted) {
        setProfileDisplayIdentity(nextIdentity || '');
      }
    };

    loadIdentity().catch(() => {
      if (isMounted) {
        setProfileDisplayIdentity(email);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [email, session?.userId]);

  return {
    handleLogout,
    handleAccountPreferences: () =>
      showComingSoon(strings.settings.accountPreferencesDescription),
    openCurrencyPicker: () => setIsCurrencyPickerOpen(true),
    closeCurrencyPicker: () => setIsCurrencyPickerOpen(false),
    selectCurrency: (code: string) => {
      const nextCurrency =
        currencyOptions.find(option => option.code === code) ?? selectedCurrency;

      if (nextCurrency.code === selectedCurrency.code) {
        setIsCurrencyPickerOpen(false);
        return;
      }

      Alert.alert(
        strings.settings.primaryCurrencyChangeTitle,
        strings.settings.primaryCurrencyChangeMessage.replace(
          '{currency}',
          `${nextCurrency.label} (${nextCurrency.symbol})`,
        ),
        [
          {
            text: strings.settings.primaryCurrencyChangeCancel,
            style: 'cancel',
          },
          {
            text: strings.settings.primaryCurrencyChangeConfirm,
            onPress: () => {
              updateCurrencyCode(nextCurrency.code).catch(() => {});
              setIsCurrencyPickerOpen(false);
            },
          },
        ],
      );
    },
    isCurrencyPickerOpen,
    currencyOptions,
    selectedCurrency,
    handleManageCategories: () =>
      navigation.navigate(ScreenConstants.MANAGE_CATEGORIES_SCREEN),
    handleOpenProfile: () => navigation.navigate(ScreenConstants.PROFILE_SCREEN),
    handlePasswordSecurity: () =>
      navigation.navigate(ScreenConstants.PASSWORD_SECURITY_SCREEN),
    handleHelpCenter: openSupportEmail,
    currentUserId: session?.userId ?? strings.settings.currentSelectionNone,
    email: profileDisplayIdentity,
    isSigningOut,
    appVersion: packageJson.version ?? '0.0.0',
    isDarkTheme: isDark,
    toggleTheme,
  };
};
