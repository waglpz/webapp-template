import Google             from '@mui/icons-material/Google';
import {
  Box,
  Button,
  CircularProgress,
}                         from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import {
  useEffect,
  useState,
}                         from 'react';
import { useDispatch }    from 'react-redux';
import { useNavigate }    from 'react-router-dom';

import { axiosInstance }      from '../../app/axiosInstance';
import { setGlobalAlertData } from '../../app/slices/miscSlice';
import { login }              from '../../app/slices/profileSlice';
import { checkTokenValid }    from '../../app/utils/auth';

const translateMap = { login: 'Anmeldung' };

const fetchProfile = async (accessToken) => {
  const response = await axiosInstance.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
  );

  return response.data;
};

export function LoginPageGoogleAccessToken() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [requestInProgress, setRequestInProgress] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: (response) => {
      return onSuccessGoogleLogin(response);
    },
    onError: (error) => {
      return onErrorGoogleLogin(error);
    },
    flow: 'implicit',
  });

  const onSuccessGoogleLogin = (response) => {
    if (response && response.access_token) {
      handleAuthResponse(response);
    } else {
      dispatch(setGlobalAlertData(response));
    }
  };

  const onErrorGoogleLogin = (error) => {
    dispatch(setGlobalAlertData(error));
  };

  useEffect(() => {
    if (checkTokenValid()) {
      navigate('/');
    }
  }, []);

  const handleAuthResponse = (authResponseData) => {
    setRequestInProgress(true);
    fetchProfile(authResponseData.access_token).then((profileData) => {
      dispatch(login({
        ...profileData,
        authData: authResponseData,
        loginAt: new Date().getTime(),
      }));
    }).catch((error) => {
      dispatch(setGlobalAlertData(error));
    }).finally(() => {
      return setRequestInProgress(false);
    });
  };

  return (
    <Box sx={{
      display: 'flex',
      width: '100%',
      height: '500px',
      bgcolor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Button
        onClick={googleLogin}
        disabled={requestInProgress}
        sx={{
          p: .7,
          pl: 1.5,
          pr: 1.5,
          fontWeight: 'bold',
          fontSize: '1.2em',
          boxShadow: 21,
          background: 'linear-gradient(to bottom, #888888 5%, #000000 90%)',
        }}
      >

        {translateMap.login}
        <Google sx={{

          color: '#4285F4',
          ml: 1,
          mr: -0.5,
          fontSize: '1.5em',
        }} />

        {requestInProgress && <CircularProgress
          size={34}
          thickness={7}
          sx={{
            color: '#F4B400',
            position: 'absolute',
            left: 139,
            zIndex: 1,
          }}
        />}
      </Button>
    </Box>
  );
}
