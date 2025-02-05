import PropTypes       from 'prop-types';
import { useEffect }   from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { login }       from '../app/slices/profileSlice';
import { decodeToken } from '../app/utils/auth';

export const LoginViaSharedToken = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    if (token) {
      const tokenData = decodeToken(token);
      if (tokenData) {
        dispatch(login({
          ...tokenData.userData,
          authData: {
            ...tokenData,
            token: token,
          },
        }));
      }
    }
  }, []);

  return (
    <>{children}</>
  );
};

LoginViaSharedToken.propTypes = { children: PropTypes.element.isRequired };
