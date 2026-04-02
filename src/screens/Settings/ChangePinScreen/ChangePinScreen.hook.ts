import { useMemo, useState } from 'react';

import { useAppPasscode } from '../../../hooks/useAppPasscode';
import { showPopup } from '../../../store';
import { useAppDispatch } from '../../../store/hooks';
import { strings } from '../../../utils/strings';

type PinStep = 'verify' | 'create' | 'confirm';

const buildPopupPayload = (message: string) => ({
  title: strings.settings.passwordSecurityScreenTitle,
  message,
  buttonLabel: strings.popup.okButton,
});

export const useChangePinScreen = (onSuccess?: () => void) => {
  const dispatch = useAppDispatch();
  const { isLoading, isEnabled, verify, setPasscode } = useAppPasscode();
  const [pinStep, setPinStep] = useState<PinStep>(isEnabled ? 'verify' : 'create');
  const [enteredPin, setEnteredPin] = useState('');
  const [draftPin, setDraftPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isSavingPin, setIsSavingPin] = useState(false);

  const progressTotal = isEnabled ? 3 : 2;

  const progressIndex = useMemo(() => {
    if (pinStep === 'verify') {
      return 0;
    }

    if (pinStep === 'confirm') {
      return progressTotal - 1;
    }

    return isEnabled ? 1 : 0;
  }, [isEnabled, pinStep, progressTotal]);

  const resetFlow = () => {
    setEnteredPin('');
    setDraftPin('');
    setPinError('');
    setIsSavingPin(false);
    setPinStep(isEnabled ? 'verify' : 'create');
  };

  const persistPin = async (pin: string) => {
    setIsSavingPin(true);

    try {
      await setPasscode(pin);
      resetFlow();
      dispatch(showPopup(buildPopupPayload(strings.settings.appPasscodeUpdatedMessage)));
      onSuccess?.();
    } catch {
      setPinError(strings.settings.passwordSecurityFailedMessage);
    } finally {
      setIsSavingPin(false);
    }
  };

  const processCompletePin = async (pin: string) => {
    if (pinStep === 'verify') {
      if (!verify(pin)) {
        setPinError(strings.settings.appPasscodeCurrentIncorrectError);
        setEnteredPin('');
        return;
      }

      setPinError('');
      setEnteredPin('');
      setPinStep('create');
      return;
    }

    if (pinStep === 'create') {
      setDraftPin(pin);
      setEnteredPin('');
      setPinError('');
      setPinStep('confirm');
      return;
    }

    if (pin !== draftPin) {
      setPinError(strings.settings.appPasscodeMismatchError);
      setEnteredPin('');
      setPinStep('create');
      return;
    }

    setPinError('');
    await persistPin(pin);
  };

  const handlePinDigitPress = (digit: string) => {
    if (isLoading || isSavingPin || enteredPin.length >= 4) {
      return;
    }

    const next = `${enteredPin}${digit}`;
    setEnteredPin(next);

    if (pinError) {
      setPinError('');
    }

    if (next.length === 4) {
      processCompletePin(next).catch(() => {
        setPinError(strings.settings.passwordSecurityFailedMessage);
      });
    }
  };

  const handlePinDelete = () => {
    if (isLoading || isSavingPin || enteredPin.length === 0) {
      return;
    }

    setEnteredPin(prev => prev.slice(0, -1));

    if (pinError) {
      setPinError('');
    }
  };

  return {
    pinStep,
    enteredPin,
    pinError,
    progressIndex,
    progressTotal,
    handlePinDigitPress,
    handlePinDelete,
  };
};

