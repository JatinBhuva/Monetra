import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type PopupPayload = {
  title: string;
  message?: string;
  buttonLabel: string;
};

type UiState = {
  popup: {
    visible: boolean;
    title: string;
    message?: string;
    buttonLabel: string;
  };
};

const initialState: UiState = {
  popup: {
    visible: false,
    title: '',
    message: undefined,
    buttonLabel: '',
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showPopup: (state, action: PayloadAction<PopupPayload>) => {
      state.popup = {
        visible: true,
        title: action.payload.title,
        message: action.payload.message,
        buttonLabel: action.payload.buttonLabel,
      };
    },
    hidePopup: state => {
      state.popup.visible = false;
    },
  },
});

export const { showPopup, hidePopup } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
