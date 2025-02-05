import axios from 'axios';

import { storeReference } from '../';

import { setGlobalAlertData } from './slices/miscSlice';
import { logout }             from './slices/profileSlice';
import { handleApiProblem }   from './utils/ApiFetch';
import { detach }             from './utils/detach';

const __ = {
  error_title: 'Uhh, ohh...',
  error_subtitle:
    'An unknown error has occurred, try to refresh page, if error persists please contact system administrator.',
};

export const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(function (config) {
  const storeState = storeReference.getState();
  const token =
    storeState &&
    storeState.profile &&
    storeState.profile.authData &&
    storeState.profile.authData.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  const errorData = error?.response?.data;
  let errorStatus;
  let title = __.error_title;
  let message = __.error_subtitle;
  if (!errorData) {

    errorStatus = error?.response?.status;
  } else {
    errorStatus = errorData?.status;
  }
  if (errorData && errorData.title) {
    title = errorData.title;
  }
  if (errorData && errorData.detail) {
    message = errorData.detail;
  }
  if (errorStatus && errorStatus >= 500) {
    const alertConfig = {
      show: true,
      title: title,
      subtitle: message,
    };

    storeReference.dispatch(setGlobalAlertData(alertConfig));

    return Promise.reject(error);
  }

  if (errorStatus && errorStatus === 401) {
    detach(() => {
      handleApiProblem(error, (error) => {
        return storeReference.dispatch(setGlobalAlertData(error));
      });
      setTimeout(() => {
        return storeReference.dispatch(logout());
      }, 1000);
    });
  }

  return Promise.reject(error);
});
