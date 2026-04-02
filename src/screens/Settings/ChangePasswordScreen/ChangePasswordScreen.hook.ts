import { useState } from 'react';

import { changeCurrentUserPassword, verifyCurrentUserPassword } from '../../../services';
import { showPopup } from '../../../store';
import { useAppDispatch } from '../../../store/hooks';
import { strings } from '../../../utils/strings';

const MIN_ACCOUNT_PASSWORD_LENGTH = 8;

const buildPopupPayload = (message: string) => ({
  title: strings.settings.passwordSecurityScreenTitle,
  message,
  buttonLabel: strings.popup.okButton,
});

export const useChangePasswordScreen = (onSuccess?: () => void) => {
  const dispatch = useAppDispatch();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountPasswordError, setAccountPasswordError] = useState('');
  const [isSavingAccountPassword, setIsSavingAccountPassword] = useState(false);

  const resetFields = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setAccountPasswordError('');
  };

  const updateAccountPassword = async () => {
    setAccountPasswordError('');

    if (!currentPassword.trim()) {
      setAccountPasswordError(strings.settings.accountPasswordCurrentRequiredError);
      return;
    }

    if (newPassword.length < MIN_ACCOUNT_PASSWORD_LENGTH) {
      setAccountPasswordError(strings.settings.accountPasswordMinLengthError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setAccountPasswordError(strings.settings.accountPasswordMismatchError);
      return;
    }

    setIsSavingAccountPassword(true);

    try {
      await verifyCurrentUserPassword(currentPassword);
      await changeCurrentUserPassword(newPassword);
      resetFields();
      dispatch(
        showPopup(buildPopupPayload(strings.settings.accountPasswordUpdatedMessage)),
      );
      onSuccess?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      const isInvalidCurrentPassword =
        message.toLowerCase().includes('invalid login credentials') ||
        message.toLowerCase().includes('invalid') ||
        message.toLowerCase().includes('incorrect');

      setAccountPasswordError(
        isInvalidCurrentPassword
          ? strings.settings.accountPasswordCurrentIncorrectError
          : message || strings.settings.passwordSecurityFailedMessage,
      );
    } finally {
      setIsSavingAccountPassword(false);
    }
  };

  return {
    currentPassword,
    newPassword,
    confirmPassword,
    accountPasswordError,
    isSavingAccountPassword,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    updateAccountPassword,
    resetFields,
  };
};
