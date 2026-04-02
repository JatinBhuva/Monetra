import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { preferencesRepository } from '../data/repositories/preferencesRepository';
import {
  loadCategoriesRequested,
  loadMonthlyStatsRequested,
  loadTransactionsRequested,
  store,
} from '../store';

import {
  type AuthSession,
  getCurrentAuthUserProfile,
  getStoredSession,
  listenToAuthSession,
  loginWithUserIdAndPassword,
  logoutUser,
} from '../services/authService';
import { flushPendingSyncQueue, syncCurrentUserData } from '../services/syncService';
import { PREFERENCE_KEYS } from '../utils/preferencesKeys';

type AuthContextValue = {
  isHydrating: boolean;
  session: AuthSession | null;
  signIn: (userId: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const BOOTSTRAP_SESSION_TIMEOUT_MS = 800;
  const [isHydrating, setIsHydrating] = useState(true);
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    let isActive = true;

    const cacheIdentityLocally = (nextSession: AuthSession) => {
      const sessionEmail = nextSession.email?.trim() ?? '';

      const writes: Array<Promise<void>> = [];

      if (sessionEmail) {
        writes.push(
          preferencesRepository.set(PREFERENCE_KEYS.PROFILE_EMAIL, sessionEmail),
        );
      }

      Promise.all(writes).catch(() => {});

      // Keep name cached in local storage without blocking app startup.
      getCurrentAuthUserProfile()
        .then(profile => {
          const fullName = profile.fullName?.trim() ?? '';
          if (!fullName) {
            return;
          }

          return preferencesRepository.set(PREFERENCE_KEYS.PROFILE_FULL_NAME, fullName);
        })
        .catch(() => {});
    };

    const loadLocalData = () => {
      store.dispatch(loadCategoriesRequested());
      store.dispatch(loadTransactionsRequested({ refresh: true }));
      store.dispatch(loadMonthlyStatsRequested());
    };

    const bootstrap = async () => {
      let didApplyResolvedSession = false;
      const applySession = (nextSession: AuthSession | null) => {
        if (!isActive) {
          return;
        }

        setSession(nextSession);

        if (nextSession) {
          cacheIdentityLocally(nextSession);
          // Load local-first so the app can open offline without waiting for remote sync.
          loadLocalData();
          syncCurrentUserData()
            .then(() => {
              if (!isActive) {
                return;
              }
              loadLocalData();
            })
            .catch(() => {
              // Keep the existing local snapshot available if sync fails during bootstrap.
            });
        }
      };

      try {
        const sessionPromise = getStoredSession();
        sessionPromise
          .then(resolvedSession => {
            if (didApplyResolvedSession) {
              return;
            }
            didApplyResolvedSession = true;
            applySession(resolvedSession);
          })
          .catch(() => {});

        const storedSession = await Promise.race<AuthSession | null>([
          sessionPromise,
          new Promise<null>(resolve => {
            setTimeout(() => resolve(null), BOOTSTRAP_SESSION_TIMEOUT_MS);
          }),
        ]);

        if (storedSession && !didApplyResolvedSession) {
          didApplyResolvedSession = true;
          applySession(storedSession);
        }
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

    const sessionEmail = nextSession.email?.trim() ?? '';
    if (sessionEmail) {
      preferencesRepository
        .set(PREFERENCE_KEYS.PROFILE_EMAIL, sessionEmail)
        .catch(() => {});
    }

    getCurrentAuthUserProfile()
      .then(profile => {
        const fullName = profile.fullName?.trim() ?? '';
        if (!fullName) {
          return;
        }
        return preferencesRepository.set(PREFERENCE_KEYS.PROFILE_FULL_NAME, fullName);
      })
      .catch(() => {});

    store.dispatch(loadCategoriesRequested());
    store.dispatch(loadTransactionsRequested({ refresh: true }));
    store.dispatch(loadMonthlyStatsRequested());

    syncCurrentUserData()
      .then(() => {
        store.dispatch(loadCategoriesRequested());
        store.dispatch(loadTransactionsRequested({ refresh: true }));
        store.dispatch(loadMonthlyStatsRequested());
      })
      .catch(() => {
        // Sign-in succeeded, so leave the user in the app and retry sync on reconnect.
      });
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
