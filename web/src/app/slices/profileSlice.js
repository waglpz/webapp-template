import { createSlice } from '@reduxjs/toolkit';

import { detach }  from '../utils/detach';
import { history } from '../utils/history';

const initialState = {
  "email": null,
  "name": null,
  "imageUrl": null,
  "authData": null,
  "loginAt": null,
  "drawerIsOpen": false,
  "roles": [],
  "orgunits": [],
  "sub": null,
  "hd": null,
  "email_verified": null,
  "picture": null,
  "given_name": null,
  "family_name": null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setDrawerIsOpen(state, action) {
      state.drawerIsOpen = action.payload;
    },
    login(state, action) {
      action.payload.orgunits = action.payload.spaces;
      action.payload.spaces = undefined;
      Object.assign(state, {
        ...action.payload,
        loginAt: new Date().getTime(),
      });
      detach(() => {
        history.push('/');
      });
    },
    logout(state) {
      Object.keys(state).forEach(key => {
        if (key !== 'drawerIsOpen') {
          state[ key ] = initialState[ key ] ?? null;
        }
      });
      detach(() => {
        if (history.location.pathname !== '/login' && history.location.pathname !== '/login-admin') {
          history.push(process.env.REACT_APP_ENV_NAME === 'DEV' ? '/login-admin' : '/login');
        }
      });
    },
  },
});

export const {
  setDrawerIsOpen,
  login,
  logout,
} = profileSlice.actions;
export default profileSlice.reducer;
