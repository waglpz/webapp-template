import axios                 from 'axios';

import { axiosInstance } from '../axiosInstance';

import { options2HttpQuery } from './helpers';

const GET = async (path, queryParams, config = {}) => {
  const queryParamsString = (queryParams ? options2HttpQuery(queryParams) : '');
  const response = await axiosInstance.get(
    `${process.env.REACT_APP_API_URL}${path}${queryParamsString}`,
    config,
  );

  return response.data;
};

const PATCH = async (path, data, config = {}) => {
  const response = await axiosInstance.patch(`${process.env.REACT_APP_API_URL}${path}`, data, config);

  return response.data;
};

const POST = async (path, data, config = {}) => {
  const response = await axiosInstance.post(`${process.env.REACT_APP_API_URL}${path}`, data, config);

  return response.data;
};

const DELETE = async (path, config = {}) => {
  const response = await axiosInstance.delete(`${process.env.REACT_APP_API_URL}${path}`, config);

  return response.data;
};

const PUT = async (path, data, config = {}) => {
  const response = await axiosInstance.put(`${process.env.REACT_APP_API_URL}${path}`, data, config);

  return response.data;
};

export const generateNewCancelToken = (cancelToken) => {
  if (cancelToken) {
    cancelToken.cancel('Canceling previous request in progress');
  }
  const newCancelToken = axios.CancelToken.source();

  return newCancelToken;
};

export const API = {
  GET,
  PATCH,
  POST,
  PUT,
  DELETE,
};

export const handleApiProblem = (error, callback) => {
  console.error('ERROR: ', error);

  const networkError = (error && error.code && error.code === 'ERR_NETWORK');

  if (networkError) {
    return callback({
      show: true,
      title: error.name || 'Network error',
      subtitle: error.message || 'Network error occurs, check internet connection.',
    });
  }

  let errorData = (error && error.response && error.response.data);

  if (errorData === '') {
    errorData = {
      show: true,
      title: error.name || 'Network error',
      subtitle: error.message || 'Network error occurs.',
    };
  }

  const errorStatus = errorData ? errorData.status : (error && error.response && error.response.status);

  if (errorStatus < 400) {
    return;
  }

  if (errorStatus === 401) {
    callback({
      title: 'Unauthorized',
      detail: '',
    });
  } else if (errorStatus === 403) {
    callback({
      title: 'Forbidden',
      detail: '',
    });
  } else {
    callback(errorData);
  }
};
