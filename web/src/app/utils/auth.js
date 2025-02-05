import { storeReference } from '../../';
import { axiosInstance }  from '../axiosInstance';

export const fetchJWT = async (authCode, extra = {}) => {
  const webappId = process.env.REACT_APP_WEBAPP_ID;
  const response = await axiosInstance.post(
    `${process.env.REACT_APP_AUTH_TOKEN_URL}`, {
      authCode,
      webappId, ...extra,
    });

  return response.data;
};

export const checkTokenValid = () => {
  const {
    authData,
    loginAt,
  } = storeReference.getState().profile;

  const exp = authData?.exp;
  if (exp) {
    const expireOnDate = new Date(Number(exp + '000'));

    return new Date().getTime() < expireOnDate.getTime();
  }

  const expiresIn = authData?.expires_in;
  if (!expiresIn || !loginAt) {
    return false;
  }

  const now = new Date().getTime();
  const expireInTime = loginAt + (expiresIn * 1000);

  return now < expireInTime;
};

export function decodeToken(token) {
  if (!token || typeof token !== 'string' || token.length === 0) {
    return;
  }

  try {
    const parsedJwt = parseJwt(token);
    const dataFromToken = JSON.parse(parsedJwt);

    return dataFromToken;
  } catch (e) {
    console.error('Invalid token');
  }
}

function parseJwt(token) {
  const base64Url = token.split('.')[ 1 ];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return jsonPayload;
}
