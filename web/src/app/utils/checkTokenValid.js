import { storeReference } from '../../index';

export const checkTokenValid = () => {
  const expireOn = storeReference.getState().currentUser.currentUser.exp;
  if (expireOn) {
    const expireOnDate = new Date(Number(expireOn + '000'));
    const tokenIsExpired = (expireOnDate.getTime() <= new Date().getTime());

    return !tokenIsExpired;
  } else {
    return false;
  }
}
