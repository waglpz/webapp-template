import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import miscSlice from './slices/miscSlice';
// import profileSlice from './slices/profileSlice';
import userSlice from './slices/userSlice';

const persistConfig = {
  key: 'root',
  storage: storage,
};

const createRootReducer = (history) => combineReducers({
  router: history,
  // profile: persistReducer(persistConfig, profileSlice),
  currentUser: persistReducer(persistConfig, userSlice),
  misc: miscSlice,
});

export default createRootReducer;
