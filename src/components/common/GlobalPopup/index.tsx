import React from 'react';

import { hidePopup } from '../../../store/uiSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { GlobalPopup } from './GlobalPopup';

export const GlobalPopupContainer = () => {
  const dispatch = useAppDispatch();
  const popup = useAppSelector(state => state.ui.popup);

  return (
    <GlobalPopup
      visible={popup.visible}
      title={popup.title}
      message={popup.message}
      buttonLabel={popup.buttonLabel}
      onClose={() => dispatch(hidePopup())}
    />
  );
};

export { GlobalPopup } from './GlobalPopup';
