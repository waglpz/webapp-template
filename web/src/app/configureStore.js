import { configureStore } from '@reduxjs/toolkit';
import { persistStore }   from 'redux-persist';

import createRootReducer from './createRootReducer';
import { history }       from './utils/history';

const rootReducer = createRootReducer(history);

export default () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({ serializableCheck: { ignoredActions: ['persist/PERSIST'] } });
    },
  });
  const persistor = persistStore(store);
  return {
    store,
    persistor,
  };
};
