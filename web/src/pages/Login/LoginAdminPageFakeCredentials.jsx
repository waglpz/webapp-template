import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
}                      from '@mui/material';
import { useSnackbar } from 'notistack';
import {
  useEffect,
  useState,
}                      from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setGlobalAlertData } from '../../app/slices/miscSlice';
import { login }              from '../../app/slices/profileSlice';
import { handleApiProblem }   from '../../app/utils/ApiFetch';
import { decodeToken }        from '../../app/utils/auth';

export function LoginAdminPageFakeCredentials() {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [requestInProgress, setRequestInProgress] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Replace checkTokenValid with a check for existing user authentication, if needed
    const isUserLoggedIn = false; // Dummy value, replace with actual logic
    if (isUserLoggedIn) {
      navigate('/');
    }
  }, [navigate]);

  const submitLogin = () => {
    setRequestInProgress(true);

    // Simulate an API call to authenticate the user with username and password
    fakeLoginApi(username, password).then((response) => {
      if (response.success) {
        console.log('RESPONSE::', response.token);
        const tokenData = (response.token && decodeToken(response.token));
        dispatch(login({
          ...tokenData.userData,
          authData: {
            ...tokenData,
            token: response.token,
          },
        }));
        navigate('/');
      } else {
        enqueueSnackbar('Login failed: ' + response.message, { variant: 'error' });
      }
    }).catch((error) => {
      handleApiProblem(error, (response) => {
        dispatch(setGlobalAlertData(response));
      });
    }).finally(() => {
      setRequestInProgress(false);
    });
  };

  // Dummy function to simulate an API login call
  const fakeLoginApi = (username, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
          if (username === 'admin' && password === 'password') {
            resolve({
              success: true,
              token :'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL2F1dGh6LXByb3ZpZGVyLnZlb2xpYS13YXNzZXIuZGUiLCJpYXQiOjE3MjkxODYyMzAsImF1ZCI6ImQyNGJjNjQwLTc0NGYtNDczOS1iNjQxLTFjYTY0NzI1OTk1ZiIsImV4cCI6MjcyOTIyOTQ0MCwidXNlckRhdGEiOnsiZW1haWwiOiJtYXgubXVzdGVybWFubkB3YWdscHotcmVmZXJlbmNlLXByb2plY3QuY29tIiwicm9sZXMiOlsiUk9MRV9NQSJdLCJzcGFjZXMiOlsiVldEIiwiTUlERVdBIl0sInN1YiI6IjExNDI4Njc4NzQ0MTU2MDU4MTY4MSIsImhkIjoidmVvbGlhLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiTWF4IE11c3Rlcm1hbm4iLCJnaXZlbl9uYW1lIjoiTWF4IiwiZmFtaWx5X25hbWUiOiJNdXN0ZXJtYW5uIn19.ozgfg9wCDNukbVop-lS-JbO7OOMcJZkfreb9NhMPkKg',
            });
          } else {
            resolve({
              success: false,
              message: 'Invalid username or password',
            });
          }
        }
        ,
        1000,
      ); // Simulate network latency
    });
  };

  return (
    <>
      <Box sx={{
        display: 'flex',
        width: '100%',
        height: '500px',
        bgcolor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Card style={{
          width: '400px',
          margin: '48px auto',
          padding: '12px',
        }}>
          <CardContent>
            <Typography variant="h6" component="h6">
              Anmelden - Admin Portal
            </Typography>

            <FormControl fullWidth sx={{ marginTop: 3 }}>
              <InputLabel htmlFor="username">Benutzername</InputLabel>
              <OutlinedInput
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                label="Benutzername"
              />
            </FormControl>

            <FormControl fullWidth sx={{ marginTop: 3 }}>
              <InputLabel htmlFor="password">Passwort</InputLabel>
              <OutlinedInput
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                label="Passwort"
              />
            </FormControl>

            <FormControl fullWidth sx={{ padding: 1, marginTop: 3 }}>
              <Button
                onClick={submitLogin}
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
            </FormControl>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
