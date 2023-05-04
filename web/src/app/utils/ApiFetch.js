import axios from 'axios';

import { axiosInstance } from '../axiosInstance';
import options2HttpQuery from './options2HttpQuery';


const GET = async (path, queryParams, config = {}) => {
  const queryParamsString = (queryParams ? options2HttpQuery(queryParams): '');
  const response = await axiosInstance.get(
    `${process.env.REACT_APP_API_URL}${path}${queryParamsString}`,
    config
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
  const response = await axiosInstance.delete(`${process.env.REACT_APP_API_URL}${path}`, config)

  return response.data
};

const generateNewCancelToken = (cancelToken) => {
  if (cancelToken) {
    cancelToken.cancel('Canceling previous request in progress');
  }
  const newCancelToken = axios.CancelToken.source();

  return newCancelToken;
};

export { GET, PATCH, POST, DELETE, generateNewCancelToken };
