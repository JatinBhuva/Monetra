import { useCallback, useEffect, useMemo, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';

import { preferencesRepository } from '../data/repositories/preferencesRepository';
import { APP_PASSCODE_CHANGED_EVENT } from '../utils/events';
import { PREFERENCE_KEYS } from '../utils/preferencesKeys';
import { hashPasscode, verifyPasscode } from '../utils/security/passcode';

const parseEnabled = (value: string | null) => value === 'true';

type AppPasscodeState = {
  enabled: boolean;
  hashedPasscode: string | null;
};

export const useAppPasscode = () => {
  const [state, setState] = useState<AppPasscodeState>({
    enabled: false,
    hashedPasscode: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadState = useCallback(async () => {
    const [enabledValue, hashedPasscode] = await Promise.all([
      preferencesRepository.get(PREFERENCE_KEYS.APP_PASSCODE_ENABLED),
      preferencesRepository.get(PREFERENCE_KEYS.APP_PASSCODE_HASH),
    ]);

    setState({
      enabled: parseEnabled(enabledValue) && Boolean(hashedPasscode),
      hashedPasscode,
    });
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadState().catch(() => {
      setIsLoading(false);
    });

    const subscription = DeviceEventEmitter.addListener(
      APP_PASSCODE_CHANGED_EVENT,
      (payload?: AppPasscodeState) => {
        if (!payload) {
          loadState().catch(() => {});
          return;
        }

        setState(payload);
      },
    );

    return () => {
      subscription.remove();
    };
  }, [loadState]);

  const emitState = useCallback((nextState: AppPasscodeState) => {
    DeviceEventEmitter.emit(APP_PASSCODE_CHANGED_EVENT, nextState);
  }, []);

  const setPasscode = useCallback(
    async (passcode: string) => {
      const hashed = hashPasscode(passcode);

      await Promise.all([
        preferencesRepository.set(PREFERENCE_KEYS.APP_PASSCODE_HASH, hashed),
        preferencesRepository.set(PREFERENCE_KEYS.APP_PASSCODE_ENABLED, 'true'),
      ]);

      const nextState = { enabled: true, hashedPasscode: hashed };
      setState(nextState);
      emitState(nextState);
    },
    [emitState],
  );

  const disablePasscode = useCallback(async () => {
    await Promise.all([
      preferencesRepository.set(PREFERENCE_KEYS.APP_PASSCODE_ENABLED, 'false'),
      preferencesRepository.set(PREFERENCE_KEYS.APP_PASSCODE_HASH, ''),
    ]);

    const nextState = { enabled: false, hashedPasscode: null };
    setState(nextState);
    emitState(nextState);
  }, [emitState]);

  const verify = useCallback(
    (passcode: string) => verifyPasscode(passcode, state.hashedPasscode),
    [state.hashedPasscode],
  );

  return useMemo(
    () => ({
      isLoading,
      isEnabled: state.enabled,
      hasPasscode: Boolean(state.hashedPasscode),
      hashedPasscode: state.hashedPasscode,
      verify,
      loadState,
      setPasscode,
      disablePasscode,
    }),
    [
      disablePasscode,
      isLoading,
      loadState,
      setPasscode,
      state.enabled,
      state.hashedPasscode,
      verify,
    ],
  );
};
