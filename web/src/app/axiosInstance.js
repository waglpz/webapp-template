import axios from 'axios';

import { detach } from './utils/detach';
import { history } from './utils/history';
import { setGlobalAlertData } from './slices/miscSlice';
import { storeReference } from '../index';
import {__forbidden, __unauthorized} from "../pages/error/__";

const translate_map = {
  error_title: 'Uhh, ohh...',
  error_subtitle: 'An unknown error has occurred, try to refresh page, if error persists please contact system administrator.',
};

export const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(function (config) {
  const currentUserEmail = storeReference.getState().currentUser.currentUser.email;
  if (currentUserEmail) {
    config.headers['X-REACT-USER'] = currentUserEmail;
  }

  return config;
});

axiosInstance.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  const errorData = (error && error.response && error.response.data);
  let errorStatus;
  let title = translate_map.error_title;
  let message = translate_map.error_subtitle;
  if (!errorData) {
    errorStatus = error.response.status;
  } else {
    errorStatus = errorData.status;
  }
  if (errorData && errorData.title) {
    title = errorData.title;
  }
  if (errorData && errorData.detail) {
    message = errorData.detail;
  }
  if (errorStatus >= 500) {
    const alertConfig = {
      show: true,
      title: title,
      subtitle: message,
    };

    storeReference.dispatch(setGlobalAlertData(alertConfig));
  } else if (errorStatus === 401) {
    detach(() => {
      history.push(__unauthorized.route.unauthorized);
    });
  } else if (errorStatus === 403) {
    detach(() => {
      history.push(__forbidden.route.forbidden);
    });
  }

  return Promise.reject(error);
});
