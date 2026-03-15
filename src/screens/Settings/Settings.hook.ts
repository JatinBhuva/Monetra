import { useEffect } from 'react';

import { clearDatabaseRequested, clearDatabaseReset, showPopup } from '../../store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { strings } from '../../utils/strings';

export const useSettings = () => {
  const dispatch = useAppDispatch();
  const clearStatus = useAppSelector(state => state.maintenance.clearStatus);

  const handleClearDatabase = () => {
    dispatch(clearDatabaseRequested());
  };

  useEffect(() => {
    if (clearStatus !== 'succeeded') {
      return;
    }

    dispatch(
      showPopup({
        title: strings.popup.databaseClearedTitle,
        message: strings.popup.databaseClearedMessage,
        buttonLabel: strings.popup.okButton,
      }),
    );
    dispatch(clearDatabaseReset());
  }, [clearStatus, dispatch]);

  return {
    clearStatus,
    handleClearDatabase,
  };
};
