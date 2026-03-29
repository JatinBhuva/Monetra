import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session } from '@supabase/supabase-js';

import { supabase } from './supabase';

const LAST_SYNCED_USER_STORAGE_KEY = 'monetra.auth.last_synced_user';
const AUTH_EMAIL_DOMAIN = 'monetra.app';

export type AuthSession = {
  authUserId: string;
  userId: string;
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
  };
};

export const logoutUser = async () => {
  await supabase.auth.signOut();
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
    });
  });
