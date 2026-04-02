import { useAppPasscode } from '../../../hooks/useAppPasscode';
import { showPopup } from '../../../store';
import { useAppDispatch } from '../../../store/hooks';
import { strings } from '../../../utils/strings';

const buildPopupPayload = (message: string) => ({
  title: strings.settings.passwordSecurityScreenTitle,
  message,
  buttonLabel: strings.popup.okButton,
});

export const usePasswordSecurity = () => {
  const dispatch = useAppDispatch();
  const { isLoading, isEnabled, disablePasscode, verify } = useAppPasscode();

  const handlePasscodeToggle = (
    nextValue: boolean,
    onEnableRequest: () => void,
    onDisableRequest: () => void,
  ) => {
    if (nextValue) {
      onEnableRequest();
      return;
    }

    if (!isEnabled) {
      return;
    }

    onDisableRequest();
  };

  const verifyPasscode = (passcode: string) => verify(passcode);

  const disablePasscodeWithVerification = async () => {
    try {
      await disablePasscode();
      return true;
    } catch {
      dispatch(
        showPopup(
          buildPopupPayload(strings.settings.passwordSecurityFailedMessage),
        ),
      );
      return false;
    }
  };

  return {
    isLoading,
    isEnabled,
    isPasscodeSwitchOn: isEnabled,
    handlePasscodeToggle,
    verifyPasscode,
    disablePasscodeWithVerification,
  };
};
