/* eslint-disable no-param-reassign,no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: '',
  name: '',
  imageUrl: null,
  accessToken: null,
  loggedIn: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    login (state, action) {
      Object.assign(state, action.payload);
      state.loggedIn = true;
    },
    logout (state) {
      Object.assign(state, initialState);
    },
  },
});

export const { login, logout } = profileSlice.actions;
export default profileSlice.reducer;
