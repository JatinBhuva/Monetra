import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session } from '@supabase/supabase-js';

import { supabase } from './supabase';

const LAST_SYNCED_USER_STORAGE_KEY = 'monetra.auth.last_synced_user';
const AUTH_EMAIL_DOMAIN = 'monetra.app';

export type AuthSession = {
  authUserId: string;
  userId: string;
  email: string | null;
};

export type AuthUserProfile = {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  createdAt: string | null;
};

const INVALID_CREDENTIALS_MESSAGE = 'Invalid user ID or password.';

const normalizeUserId = (value: string) => value.trim();
const toAuthEmail = (userId: string) =>
  `${normalizeUserId(userId)}@${AUTH_EMAIL_DOMAIN}`;
const fromAuthEmail = (email?: string | null) =>
  email?.endsWith(`@${AUTH_EMAIL_DOMAIN}`)
    ? email.replace(`@${AUTH_EMAIL_DOMAIN}`, '')
    : null;

export const getStoredSession = async (): Promise<AuthSession | null> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return null;
  }

  return {
    authUserId: session.user.id,
    userId: fromAuthEmail(session.user.email) ?? session.user.id,
    email: session.user.email ?? null,
  };
};

export const loginWithUserIdAndPassword = async (
  userId: string,
  password: string,
): Promise<AuthSession> => {
  const normalizedUserId = normalizeUserId(userId);

  if (!normalizedUserId || !password) {
    throw new Error('User ID and password are required.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: toAuthEmail(normalizedUserId),
    password,
  });

  if (error) {
    throw new Error(error.message || INVALID_CREDENTIALS_MESSAGE);
  }

  if (!data.user) {
    throw new Error(INVALID_CREDENTIALS_MESSAGE);
  }

  return {
    authUserId: data.user.id,
    userId: normalizedUserId,
    email: data.user.email ?? toAuthEmail(normalizedUserId),
  };
};

export const logoutUser = async () => {
  await supabase.auth.signOut();
};

export const changeCurrentUserPassword = async (nextPassword: string) => {
  const normalizedPassword = nextPassword.trim();

  if (!normalizedPassword) {
    throw new Error('Password is required.');
  }

  const { error } = await supabase.auth.updateUser({
    password: normalizedPassword,
  });

  if (error) {
    throw new Error(error.message || 'Unable to update password right now.');
  }
};

export const getCurrentAuthUserProfile = async (): Promise<AuthUserProfile> => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error(error?.message || 'Unable to load user profile.');
  }

  const metadata = user.user_metadata ?? {};

  return {
    fullName:
      typeof metadata.full_name === 'string' ? metadata.full_name.trim() : null,
    email:
      (typeof metadata.contact_email === 'string'
        ? metadata.contact_email.trim()
        : '') ||
      user.email ||
      null,
    phone: typeof metadata.phone === 'string' ? metadata.phone.trim() : null,
    createdAt: user.created_at ?? null,
  };
};

export const updateCurrentAuthUserProfile = async (payload: {
  fullName?: string;
  email?: string;
  phone?: string;
}) => {
  const nextMetadata: Record<string, string | null> = {};

  if (payload.fullName !== undefined) {
    nextMetadata.full_name = payload.fullName.trim() || null;
  }

  if (payload.email !== undefined) {
    nextMetadata.contact_email = payload.email.trim() || null;
  }

  if (payload.phone !== undefined) {
    nextMetadata.phone = payload.phone.trim() || null;
  }

  const { error } = await supabase.auth.updateUser({
    data: nextMetadata,
  });

  if (error) {
    throw new Error(error.message || 'Unable to update profile right now.');
  }
};

export const verifyCurrentUserPassword = async (currentPassword: string) => {
  const normalizedPassword = currentPassword.trim();

  if (!normalizedPassword) {
    throw new Error('Current password is required.');
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.email) {
    throw new Error('Unable to verify current user session.');
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: normalizedPassword,
  });

  if (error) {
    throw new Error(error.message || 'Current password is incorrect.');
  }
};

export const getCurrentUserId = async () => {
  const session = await getStoredSession();
  return session?.userId ?? null;
};

export const getCurrentAuthUserId = async () => {
  const session = await getStoredSession();
  return session?.authUserId ?? null;
};

export const requireCurrentUserId = async () => {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error('No logged in user found.');
  }

  return userId;
};

export const requireCurrentAuthUserId = async () => {
  const authUserId = await getCurrentAuthUserId();

  if (!authUserId) {
    throw new Error('No logged in user found.');
  }

  return authUserId;
};

export const getLastSyncedUserId = async () =>
  AsyncStorage.getItem(LAST_SYNCED_USER_STORAGE_KEY);

export const setLastSyncedUserId = async (userId: string) => {
  await AsyncStorage.setItem(LAST_SYNCED_USER_STORAGE_KEY, userId);
};

export const listenToAuthSession = (
  listener: (session: AuthSession | null) => void,
) =>
  supabase.auth.onAuthStateChange((_event, session: Session | null) => {
    if (!session?.user) {
      listener(null);
      return;
    }

    listener({
      authUserId: session.user.id,
      userId: fromAuthEmail(session.user.email) ?? session.user.id,
      email: session.user.email ?? null,
    });
  });
