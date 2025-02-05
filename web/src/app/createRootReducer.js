import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer }  from 'redux-persist';
import storage             from 'redux-persist/lib/storage'; // defaults to localStorage for web

import miscSlice           from './slices/miscSlice';
import profileSlice        from './slices/profileSlice';

const persistConfig = { key: 'root', storage: storage };

const createRootReducer = (history) => {
  return combineReducers({
    router: history,
    profile: persistReducer(persistConfig, profileSlice),
    misc: miscSlice,
  });
};

export default createRootReducer;
