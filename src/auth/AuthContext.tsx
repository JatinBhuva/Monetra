import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import {
  loadCategoriesRequested,
  loadMonthlyStatsRequested,
  loadTransactionsRequested,
  store,
} from '../store';

import {
  type AuthSession,
  getStoredSession,
  listenToAuthSession,
  loginWithUserIdAndPassword,
  logoutUser,
} from '../services/authService';
import { flushPendingSyncQueue, syncCurrentUserData } from '../services/syncService';

type AuthContextValue = {
  isHydrating: boolean;
  session: AuthSession | null;
  signIn: (userId: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isHydrating, setIsHydrating] = useState(true);
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    let isActive = true;

    const bootstrap = async () => {
      try {
        const storedSession = await getStoredSession();

        if (!isActive) {
          return;
        }

        if (storedSession) {
          try {
            await syncCurrentUserData();
            store.dispatch(loadCategoriesRequested());
            store.dispatch(loadTransactionsRequested({ refresh: true }));
            store.dispatch(loadMonthlyStatsRequested());
          } catch {
            // Keep the existing local snapshot available if sync fails during bootstrap.
          }
        }

        setSession(storedSession);
      } finally {
        if (isActive) {
          setIsHydrating(false);
        }
      }
    };

    bootstrap();

    const {
      data: { subscription },
    } = listenToAuthSession(nextSession => {
      if (!isActive) {
        return;
      }

      setSession(nextSession);
    });

    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      if (!isActive || !state.isConnected) {
        return;
      }

      flushPendingSyncQueue().catch(() => {});
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
      unsubscribeNetInfo();
    };
  }, []);

  const signIn = async (userId: string, password: string) => {
    const nextSession = await loginWithUserIdAndPassword(userId, password);
    setSession(nextSession);

    try {
      await syncCurrentUserData();
      store.dispatch(loadCategoriesRequested());
      store.dispatch(loadTransactionsRequested({ refresh: true }));
      store.dispatch(loadMonthlyStatsRequested());
    } catch {
      // Sign-in succeeded, so leave the user in the app and retry sync on reconnect.
    }
  };

  const signOut = async () => {
    await logoutUser();
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isHydrating,
        session,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
};
