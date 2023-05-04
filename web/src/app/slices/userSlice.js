import {createSlice} from '@reduxjs/toolkit';

import {detach} from '../utils/detach';
import {history} from '../utils/history';

const userSlice = createSlice({
  name: 'currentUser',
  initialState: {
    currentUser: {},
  },
  reducers: {
    login(state, action) {
      state.currentUser = action.payload;
      detach(() => {
        history.push('/');
      });
    },
    logout(state) {
      state.currentUser = {};
      detach(() => {
        history.push('/login');
      });
    },
  },
});

export const {login, logout} = userSlice.actions;
export default userSlice.reducer;
