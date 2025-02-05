import { StrictMode }                 from 'react';
import { createRoot }                 from 'react-dom/client';
import { Provider }                   from 'react-redux';
import { PersistGate }                from 'redux-persist/integration/react';

import './index.css';
import App                            from './App';
import configureStore                 from './app/configureStore';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const { store, persistor } = configureStore();
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <StrictMode>
        <App />
      </StrictMode>
    </PersistGate>
  </Provider>,
);

if (process.env.NODE_ENV !== 'production') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister();
      });
    });
  }

  if ('caches' in window) {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName); // Löscht alle Caches
      });
    });
  }
} else {
  serviceWorkerRegistration.register();
}

export const storeReference = store;
