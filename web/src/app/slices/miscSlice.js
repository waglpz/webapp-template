import { createSlice } from '@reduxjs/toolkit';

import {
  ORGUNIT_ENUM,
  ROLES_ENUM,
} from '../utils/coreConstants';

const initialState = {
  globalAlertData: {
    show: false,
    title: '...',
    subtitle: '...',
  },
  orgunitsList: [
    {
      value: ORGUNIT_ENUM.ORGUNIT_VWD,
      label: 'VWD',
      description: 'Kundendienst VWD',
    },
    {
      value: ORGUNIT_ENUM.ORGUNIT_MIDEWA,
      label: 'MIDEWA',
      description: 'Kundendienst Midewa',
    },
  ],
  rolesList: [
    {
      value: ROLES_ENUM.ROLE_RW,
      label: 'Verwalter',
      description: 'Nutzer mit diese Rolle hat alle Rechte.',
    },
    {
      value: ROLES_ENUM.ROLE_RO,
      label: 'Reporter',
      description: 'Nutzer mit diese Rolle darf nichts ändern.',
    },
  ],
};

const miscSlice = createSlice({
  name: 'misc',
  initialState,
  reducers: {
    setGlobalAlertData(state, action) {
      state.globalAlertData = { ...state.globalAlertData, ...action.payload };
      if (action.payload && action.payload.subtitle) {
        state.globalAlertData.subtitle = action.payload.subtitle;
      } else if (action.payload && action.payload.detail) {
        state.globalAlertData.subtitle = action.payload.detail;
      } else {
        state.globalAlertData.subtitle = '... nop :/';
      }
    },
  },
});

export const miscReduxData = (state) => {
  return state.misc;
};
export const { setGlobalAlertData } = miscSlice.actions;
export default miscSlice.reducer;
