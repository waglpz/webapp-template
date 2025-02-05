import GoogleIcon         from '@mui/icons-material/Google';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Switch,
  Typography,
}                         from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import { useSnackbar }    from 'notistack';
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


export function LoginAdminPageOhneRollen() {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [requestInProgress, setRequestInProgress] = useState(false);
  const [code, setCode] = useState(undefined);
  const [useTokenOnly, setUseTokenOnly] = useState(false);
  const [token, setToken] = useState();

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
      setCode(response.code);
    } else {
      handleApiProblem(response, (response) => {
        return dispatch(setGlobalAlertData(response));
      });
    }
  };

  const onErrorGoogleLogin = (error) => {
    handleApiProblem(error, (response) => {
      return dispatch(setGlobalAlertData(response));
    });
  };

  useEffect(() => {
    if (checkTokenValid()) {
      navigate('/');
    }
  }, []);

  const submitCode = () => {
    setRequestInProgress(true);
    fetchJWT(code, {
      fakeRoleAndSpaces: {
        roles: [],
        spaces: [],
      },
    }).then((response) => {
      if (useTokenOnly) {
        setToken(response.token);
      } else {
        const tokenData = (response.token && decodeToken(response.token));
        dispatch(login({
          ...tokenData.userData,
          authData: {
            ...tokenData,
            token: response.token,
          },
        }));
      }
    }).catch((error) => {
      handleApiProblem(error, (response) => {
        return dispatch(setGlobalAlertData(response));
      });
    }).finally(() => {
      return setRequestInProgress(false);
    });
  };

  function onSwitchTokenOnly(event) {
    setUseTokenOnly(event.target.checked);
  }

  const copyJwt = async () => {
    await navigator.clipboard.writeText(token);
    enqueueSnackbar('JWT ins Zwischenablage kopiert', { variant: 'success' });
  };

  return (
    <>
      {code === undefined &&
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

            Anmelden
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
      }
      {code !== undefined &&
        <Card style={{
          width: '400px',
          margin: '48px auto',
          padding: '12px',
        }}>
          <CardContent>
            <Typography variant="h6" component="h6">
              Anmelden abschliessen -
              {' '}
              {process.env.REACT_APP_NAME}
            </Typography>
            <FormControl fullWidth sx={{
              marginTop: 3,
              ml: 1,
            }}>
              <FormControlLabel
                control={<Switch onChange={onSwitchTokenOnly} />}
                label="JWT anzeigen" />
              <FormControl fullWidth sx={{
                padding: 1,
                marginTop: 3,
              }}>
                <Button
                  onClick={submitCode}
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
                >Anmelden
                </Button>
              </FormControl>
            </FormControl>
            {token && useTokenOnly && <FormControl fullWidth sx={{
              padding: 1,
              marginTop: 3,
            }}>
              <InputLabel htmlFor="jwt-abc">JWT</InputLabel>
              <OutlinedInput
                id="jwt"
                value={token}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="copy jwt"
                      onClick={copyJwt}
                      edge="end"
                    >
                      copy
                    </IconButton>
                  </InputAdornment>
                }
                label="JWT"
              />
            </FormControl>}
          </CardContent>
        </Card>
      }
    </>
  );
}
