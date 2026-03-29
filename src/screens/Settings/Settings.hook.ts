import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '../../auth/AuthContext';
import packageJson from '../../../package.json';
import { preferencesRepository } from '../../data/repositories/preferencesRepository';
import {
  clearDatabaseRequested,
  clearDatabaseReset,
  showPopup,
} from '../../store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { resolveCategoryLabel } from '../../utils/categoryLabel';
import { strings } from '../../utils/strings';

export const useSettings = () => {
  const dispatch = useAppDispatch();
  const { session, signOut } = useAuth();
  const clearStatus = useAppSelector(state => state.maintenance.clearStatus);
  const categories = useAppSelector(state => state.categories.items);
  const [lastType, setLastType] = useState<string | null>(null);
  const [lastCategoryId, setLastCategoryId] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleClearDatabase = () => {
    dispatch(clearDatabaseRequested());
  };

  const handleManageCategories = () => {
    dispatch(
      showPopup({
        title: strings.popup.comingSoonTitle,
        message: strings.popup.manageCategoriesMessage,
        buttonLabel: strings.popup.okButton,
      }),
    );
  };

  const handleManageLanguage = () => {
    dispatch(
      showPopup({
        title: strings.popup.comingSoonTitle,
        message: strings.popup.languageMessage,
        buttonLabel: strings.popup.okButton,
      }),
    );
  };

  const handleExportData = () => {
    dispatch(
      showPopup({
        title: strings.popup.comingSoonTitle,
        message: strings.popup.exportDataMessage,
        buttonLabel: strings.popup.okButton,
      }),
    );
  };

  const handleImportData = () => {
    dispatch(
      showPopup({
        title: strings.popup.comingSoonTitle,
        message: strings.popup.importDataMessage,
        buttonLabel: strings.popup.okButton,
      }),
    );
  };

  const handleBackupSync = () => {
    dispatch(
      showPopup({
        title: strings.popup.comingSoonTitle,
        message: strings.popup.backupSyncMessage,
        buttonLabel: strings.popup.okButton,
      }),
    );
  };

  const handleQuickDate = () => {
    dispatch(
      showPopup({
        title: strings.popup.comingSoonTitle,
        message: strings.popup.quickDateMessage,
        buttonLabel: strings.popup.okButton,
      }),
    );
  };

  const handleRecurring = () => {
    dispatch(
      showPopup({
        title: strings.popup.comingSoonTitle,
        message: strings.popup.recurringMessage,
        buttonLabel: strings.popup.okButton,
      }),
    );
  };

  const handleMultiCurrency = () => {
    dispatch(
      showPopup({
        title: strings.popup.comingSoonTitle,
        message: strings.popup.multiCurrencyMessage,
        buttonLabel: strings.popup.okButton,
      }),
    );
  };

  const handleLogout = async () => {
    setIsSigningOut(true);

    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  const lastCategoryLabel = useMemo(() => {
    if (!lastCategoryId) {
      return null;
    }
    const match = categories.find(item => item.id === lastCategoryId);
    return match ? resolveCategoryLabel(match) : null;
  }, [categories, lastCategoryId]);

  useEffect(() => {
    let isActive = true;

    const loadSelections = async () => {
      const [storedType, storedCategoryId] = await Promise.all([
        preferencesRepository.get('lastType'),
        preferencesRepository.get('lastCategoryId'),
      ]);

      if (!isActive) {
        return;
      }

      setLastType(storedType);
      setLastCategoryId(storedCategoryId);
    };

    loadSelections();

    return () => {
      isActive = false;
    };
  }, []);

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
    handleManageCategories,
    handleManageLanguage,
    handleExportData,
    handleImportData,
    handleBackupSync,
    handleQuickDate,
    handleRecurring,
    handleMultiCurrency,
    handleLogout,
    lastType,
    lastCategoryLabel,
    currentUserId: session?.userId ?? strings.settings.currentSelectionNone,
    isSigningOut,
    appVersion: packageJson.version ?? '0.0.0',
  };
};
