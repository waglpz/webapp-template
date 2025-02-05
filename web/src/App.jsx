import HomeIcon                from '@mui/icons-material/Home';
import PsychologyAltIcon       from '@mui/icons-material/PsychologyAlt';
import {
  createTheme,
  CssBaseline,
  ThemeProvider,
}                              from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SnackbarProvider }    from 'notistack';
import {
  Route,
  Routes,
  unstable_HistoryRouter as HistoryRouter,
}                              from 'react-router-dom';
import { ToastContainer }      from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ROLES_ENUM }           from './app/utils/coreConstants';
import { history }              from './app/utils/history';
import { userRoutingRightsMap } from './app/utils/routeAccessPermitted';
import * as Component           from './components';
import * as Page                from './pages';
import t9nError                 from './pages/Error/t9n/de.json';

const theme = createTheme({
  palette: {
    text: {
      primary: 'rgb(52, 58, 64, 0.95)',
      secondary: 'rgba(0, 0, 0, 0.54)',
      disabled: 'rgba(0, 0, 0, 0.38)',
      hint: 'rgba(0, 0, 0, 0.38)',
    },
    primary: { main: 'rgb(52, 58, 64, 0.9)' },
  },
  components: {
    MUIDataTableHeadCell: {
      styleOverrides: {
        contentWrapper: {
          padding: 0,
          margin: 0,
        },
      },
    },
    MuiButton: {
      defaultProps: { variant: 'contained' },
      styleOverrides: { root: { color: 'primary' } },
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

userRoutingRightsMap[ '/home' ] = {
  component: <Page.HomePage/>,
  roles: [
    ROLES_ENUM.ROLE_MA,
  ],
};

const App = () => {
  return (
    <HistoryRouter history={history}>
      <Component.LoginViaSharedToken>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLECLIENTID}>
          <CssBaseline/>
          <ThemeProvider theme={theme}>
            <SnackbarProvider autoHideDuration={3000} maxSnack={3}
                              anchorOrigin={{
                                horizontal: 'right',
                                vertical: 'bottom',
                              }}>
              <Component.Layout leftMenu={
                <Component.LeftMenu>
                  <Component.NavCollapsed
                    subtitle="Beispielmenu"
                    title="Hauptmenu"
                    iconCallback={(activeColor) => {
                      return <HomeIcon sx={{ color: activeColor }}/>;
                    }}
                    parentActiveColor="#ec0c20"
                    navElementsProps={[
                      {
                        route: '/home',
                        title: 'Startseite',
                        tooltip: 'zur Startseite navigieren',
                        subtitle: 'Anfang vom Ende',
                        parentActiveColor: '#ec0c20',
                        iconCallback: (activeColor) => {
                          return <PsychologyAltIcon sx={{ color: activeColor }}/>;
                        },
                      },
                    ]}/>
                </Component.LeftMenu>
              }>
                <>
                  <ToastContainer/>
                  <Component.PreloaderLinear color="info"
                                             variant="determinate"/>
                  <Routes>
                    <Route exact path="/login-admin"
                           element={<Page.LoginAdminPageFakeCredentials/>}/>
                    <Route exact path="/login"
                           element={<Page.LoginPageGoogleAuthCode/>}/>
                    {
                      Object.keys(userRoutingRightsMap).map((key) => {
                        return (
                          <Route exact path={key} key={key} element={
                            <Component.RouteGuard
                              roles={userRoutingRightsMap[ key ].roles}>
                              {userRoutingRightsMap[ key ].component}
                            </Component.RouteGuard>
                          }/>
                        );
                      })
                    }

                    <Route exact path={t9nError.notFoundPage.route.pageNotFound}
                           element={<Page.NotFoundPage/>}/>
                    <Route exact path={t9nError.forbidden.route.forbidden}
                           element={<Page.ForbiddenPage/>}/>
                    <Route exact path={t9nError.unauthorized.route.unauthorized}
                           element={<Page.UnauthorizedPage/>}/>
                  </Routes>
                  <Component.GlobalAlert/>
                </>
              </Component.Layout>
            </SnackbarProvider>
          </ThemeProvider>
        </GoogleOAuthProvider>
      </Component.LoginViaSharedToken>
    </HistoryRouter>
  );
};
export default App;
