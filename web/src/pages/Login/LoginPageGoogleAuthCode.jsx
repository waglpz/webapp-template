import GoogleIcon         from '@mui/icons-material/Google';
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

import { setGlobalAlertData } from '../../app/slices/miscSlice';
import { login }              from '../../app/slices/profileSlice';
import { handleApiProblem }   from '../../app/utils/ApiFetch';
import {
  checkTokenValid,
  decodeToken,
  fetchJWT,
}                             from '../../app/utils/auth';

const translate_map = { login: 'Anmeldung' };

export function LoginPageGoogleAuthCode() {
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
    flow: 'auth-code',
  });

  const onSuccessGoogleLogin = (response) => {
    if (response && response.code) {
      submitCode(response.code);
    } else {
      dispatch(setGlobalAlertData(response));
    }
  };

  const onErrorGoogleLogin = (error) => {
    dispatch(setGlobalAlertData(error.response));
  };

  useEffect(() => {
    if (checkTokenValid()) {
      navigate('/');
    }
  }, []);

  const submitCode = (code) => {
    setRequestInProgress(true);
    fetchJWT(code).then((data) => {
      const tokenData = (data.token && decodeToken(data.token));
      dispatch(login({
        ...tokenData.userData,
        authData: {
          ...tokenData,
          token: data.token,
        },
      }));
    }).catch((error) => {
      handleApiProblem(error, (response) => {
        return dispatch(setGlobalAlertData(response));
      });
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

        {translate_map.login}
        <GoogleIcon sx={{

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
