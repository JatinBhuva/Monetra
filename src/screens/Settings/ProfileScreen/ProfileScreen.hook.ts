import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAuth } from '../../../auth/AuthContext';
import { preferencesRepository } from '../../../data/repositories/preferencesRepository';
import {
  getCurrentAuthUserProfile,
  updateCurrentAuthUserProfile,
} from '../../../services/authService';
import { showPopup } from '../../../store';
import { useAppDispatch } from '../../../store/hooks';
import { PREFERENCE_KEYS } from '../../../utils/preferencesKeys';
import { strings } from '../../../utils/strings';

type ProfileFormState = {
  fullName: string;
  email: string;
  phone: string;
  memberSinceYear: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+()\-\s]{8,20}$/;

const getYearFromIso = (value?: string | null) => {
  if (!value) {
    return `${new Date().getFullYear()}`;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return `${new Date().getFullYear()}`;
  }

  return `${parsed.getFullYear()}`;
};

const normalizeValue = (value: string) => value.trim();

export const useProfileScreen = () => {
  const dispatch = useAppDispatch();
  const { session } = useAuth();
  const [formState, setFormState] = useState<ProfileFormState>({
    fullName: '',
    email: '',
    phone: '',
    memberSinceYear: `${new Date().getFullYear()}`,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const setField = useCallback((field: keyof Omit<ProfileFormState, 'memberSinceYear'>, value: string) => {
    setError('');
    setFormState(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const [savedFullName, savedEmail, savedPhone, authProfile] = await Promise.all([
          preferencesRepository.get(PREFERENCE_KEYS.PROFILE_FULL_NAME),
          preferencesRepository.get(PREFERENCE_KEYS.PROFILE_EMAIL),
          preferencesRepository.get(PREFERENCE_KEYS.PROFILE_PHONE),
          getCurrentAuthUserProfile().catch(() => null),
        ]);

        if (!isMounted) {
          return;
        }

        setFormState({
          fullName: savedFullName ?? authProfile?.fullName ?? session?.userId ?? '',
          email: authProfile?.email ?? savedEmail ?? '',
          phone: savedPhone ?? authProfile?.phone ?? '',
          memberSinceYear: getYearFromIso(authProfile?.createdAt),
        });

        const localCacheWrites: Array<Promise<void>> = [];
        const resolvedFullName = (savedFullName ?? authProfile?.fullName ?? '').trim();
        const resolvedEmail = (authProfile?.email ?? savedEmail ?? '').trim();
        const resolvedPhone = (savedPhone ?? authProfile?.phone ?? '').trim();

        // Ensure remote-fetched profile data is available offline as local preferences.
        if (!savedFullName && resolvedFullName) {
          localCacheWrites.push(
            preferencesRepository.set(PREFERENCE_KEYS.PROFILE_FULL_NAME, resolvedFullName),
          );
        }

        if (!savedEmail && resolvedEmail) {
          localCacheWrites.push(
            preferencesRepository.set(PREFERENCE_KEYS.PROFILE_EMAIL, resolvedEmail),
          );
        }

        if (!savedPhone && resolvedPhone) {
          localCacheWrites.push(
            preferencesRepository.set(PREFERENCE_KEYS.PROFILE_PHONE, resolvedPhone),
          );
        }

        if (localCacheWrites.length > 0) {
          await Promise.all(localCacheWrites);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [session?.userId]);

  const validate = useCallback(() => {
    const normalizedName = normalizeValue(formState.fullName);
    const normalizedEmail = normalizeValue(formState.email);
    const normalizedPhone = normalizeValue(formState.phone);

    if (!normalizedName) {
      return strings.settings.profileNameRequiredError;
    }

    if (normalizedEmail && !emailRegex.test(normalizedEmail)) {
      return strings.settings.profileEmailInvalidError;
    }

    if (normalizedPhone && !phoneRegex.test(normalizedPhone)) {
      return strings.settings.profilePhoneInvalidError;
    }

    return '';
  }, [formState.email, formState.fullName, formState.phone]);

  const saveProfile = useCallback(async () => {
    const nextError = validate();
    setError(nextError);

    if (nextError) {
      return;
    }

    setIsSaving(true);

    const payload = {
      fullName: normalizeValue(formState.fullName),
      email: normalizeValue(formState.email),
      phone: normalizeValue(formState.phone),
    };

    try {
      await Promise.all([
        preferencesRepository.set(PREFERENCE_KEYS.PROFILE_FULL_NAME, payload.fullName),
        preferencesRepository.set(PREFERENCE_KEYS.PROFILE_EMAIL, payload.email),
        preferencesRepository.set(PREFERENCE_KEYS.PROFILE_PHONE, payload.phone),
      ]);

      try {
        await updateCurrentAuthUserProfile(payload);
      } catch {
        // Preferences are already saved locally and queued for remote sync if needed.
      }

      dispatch(
        showPopup({
          title: strings.settings.profileScreenTitle,
          message: strings.settings.profileUpdatedMessage,
          buttonLabel: strings.popup.okButton,
        }),
      );
    } catch {
      dispatch(
        showPopup({
          title: strings.popup.comingSoonTitle,
          message: strings.settings.profileUpdateFailedMessage,
          buttonLabel: strings.popup.okButton,
        }),
      );
    } finally {
      setIsSaving(false);
    }
  }, [dispatch, formState.email, formState.fullName, formState.phone, validate]);

  const initials = useMemo(() => {
    const parts = normalizeValue(formState.fullName)
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2);

    if (parts.length === 0) {
      return 'U';
    }

    return parts.map(part => part[0]?.toUpperCase() ?? '').join('');
  }, [formState.fullName]);

  return {
    fullName: formState.fullName,
    email: formState.email,
    phone: formState.phone,
    memberSinceYear: formState.memberSinceYear,
    initials,
    isLoading,
    isSaving,
    error,
    setFullName: (value: string) => setField('fullName', value),
    setEmail: (value: string) => setField('email', value),
    setPhone: (value: string) => setField('phone', value),
    saveProfile,
  };
};
