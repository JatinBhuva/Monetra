import { useMemo, useState } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '../../auth/AuthContext';
import packageJson from '../../../package.json';
import { showPopup } from '../../store';
import { useAppDispatch } from '../../store/hooks';
import { useAppTheme } from '../../theme';
import type { LoggedInStackParamList } from '../../types';
import { ScreenConstants } from '../../utils/constants';
import { strings } from '../../utils/strings';

export const useSettings = () => {
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<LoggedInStackParamList>>();
  const { session, signOut } = useAuth();
  const { isDark, toggleTheme } = useAppTheme();
  const [isSigningOut, setIsSigningOut] = useState(false);

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
    if (!session?.userId || session.userId === strings.settings.currentSelectionNone) {
      return strings.settings.currentSelectionNone;
    }

    return `${session.userId}@monetra.app`;
  }, [session?.userId]);

  return {
    handleLogout,
    handleAccountPreferences: () =>
      showComingSoon(strings.settings.accountPreferencesDescription),
    handleManageCategories: () =>
      navigation.navigate(ScreenConstants.MANAGE_CATEGORIES_SCREEN),
    handlePasswordSecurity: () =>
      showComingSoon(strings.settings.passwordSecurityDescription),
    handleHelpCenter: openSupportEmail,
    currentUserId: session?.userId ?? strings.settings.currentSelectionNone,
    email,
    isSigningOut,
    appVersion: packageJson.version ?? '0.0.0',
    isDarkTheme: isDark,
    toggleTheme,
  };
};
