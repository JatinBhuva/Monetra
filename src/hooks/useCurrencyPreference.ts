import { useCallback, useEffect, useMemo, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';

import { preferencesRepository } from '../data/repositories/preferencesRepository';
import {
  CURRENCY_OPTIONS,
  DEFAULT_CURRENCY_CODE,
  getCurrencyOption,
} from '../utils/currencies';
import { CURRENCY_PREFERENCE_CHANGED_EVENT } from '../utils/events';
import { PREFERENCE_KEYS } from '../utils/preferencesKeys';

export const useCurrencyPreference = () => {
  const [currencyCode, setCurrencyCode] = useState(DEFAULT_CURRENCY_CODE);

  useEffect(() => {
    let isMounted = true;

    const loadCurrency = async () => {
      const saved = await preferencesRepository.get(
        PREFERENCE_KEYS.PRIMARY_CURRENCY_CODE,
      );
      if (!isMounted || !saved) {
        return;
      }
      setCurrencyCode(saved.toUpperCase());
    };

    loadCurrency();

    const subscription = DeviceEventEmitter.addListener(
      CURRENCY_PREFERENCE_CHANGED_EVENT,
      (nextCode: string) => {
        setCurrencyCode(nextCode.toUpperCase());
      },
    );

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);

  const updateCurrencyCode = useCallback(async (nextCode: string) => {
    const normalized = nextCode.toUpperCase();
    await preferencesRepository.set(PREFERENCE_KEYS.PRIMARY_CURRENCY_CODE, normalized);
    setCurrencyCode(normalized);
    DeviceEventEmitter.emit(CURRENCY_PREFERENCE_CHANGED_EVENT, normalized);
  }, []);

  const selectedCurrency = useMemo(
    () => getCurrencyOption(currencyCode),
    [currencyCode],
  );

  return {
    currencyCode,
    currencySymbol: selectedCurrency.symbol,
    selectedCurrency,
    currencyOptions: CURRENCY_OPTIONS,
    updateCurrencyCode,
  };
};
