import React from 'react';
import {
  Route,
  Routes,
  unstable_HistoryRouter as HistoryRouter
} from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import {
  createTheme,
  CssBaseline,
  ThemeProvider
} from '@mui/material';

import { history } from './app/utils/history';
import GlobalAlert from './components/GlobalAlert';
import Layout from './components/Layout';

import HomePage from './pages/HomePage';
import {__forbidden, __notFoundPage, __unauthorized} from "./pages/error/__";
import {
  ForbiddenPage,
  UnauthorizedPage,
  NotFoundPage,
} from './pages/error/ErrorPage';

import LoginPage from "./pages/login/Login";

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(52, 58, 64)',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained',
      },
      styleOverrides: {
        root: {
          color: 'primary',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
        variant: 'outlined',
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          padding: 0,
          margin: 8,
          borderWidth: 0,
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        size: 'small',
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          padding: 0,
          margin: 8,
          borderWidth: 0,
        },
      },
    },
  },
});

const App = () => (
  <HistoryRouter history={history}>
    <CssBaseline/>
    <ThemeProvider theme={theme}>
      <SnackbarProvider autoHideDuration={3000} maxSnack={3} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <Layout>
            <>
              <Routes>
                <Route exact path="/" element={<HomePage/>} />
                <Route exact path="/login" element={<LoginPage/>} />
                <Route exact path={__notFoundPage.route.pageNotFound} element={<NotFoundPage/>} />
                <Route exact path={__forbidden.route.forbidden} element={<ForbiddenPage/>} />
                <Route exact path={__unauthorized.route.unauthorized} element={<UnauthorizedPage/>} />
              </Routes>
              <GlobalAlert/>
            </>
          </Layout>
      </SnackbarProvider>
    </ThemeProvider>
  </HistoryRouter>
);
export default App;
