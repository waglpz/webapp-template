import axios from 'axios';
import {
  useState,
  useEffect,
}            from 'react';

export const useAxiosPreloader = (axiosInstance) => {
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer;
    if (isActive) {
      timer = setInterval(() => {
        setProgress((prevProgress) => {
          return prevProgress >= 200 ? 0 : prevProgress + 1;
        });
      }, 1);
    } else {
      setProgress(0);
    }

    const requestInterceptor = axiosInstance.interceptors.request.use(
      (request) => {
        setIsActive(true);
        setProgress(0);
        return request;
      },
      (error) => {
        setIsActive(false);
        setProgress(0);

        return Promise.reject(error);
      },
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        setTimeout(() => {
          setProgress(0);
          setIsActive(false);
        }, 888);

        return response;
      },
      (error) => {
        if (axios.isCancel(error)) {
          return Promise.reject(error);
        }
        setProgress(0);
        setIsActive(false);

        return Promise.reject(error);
      },
    );

    return () => {
      clearInterval(timer);
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [isActive, axiosInstance]);

  return { progress, activePreloader: isActive };
};
