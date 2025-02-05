import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon        from '@mui/icons-material/Menu';
import {
  AppBar as MuiAppBar,
  Box,
  Divider,
  Drawer as MuiDrawer,
  IconButton,
  styled,
  Toolbar,
  Typography,
}                      from '@mui/material';
import PropTypes       from 'prop-types';
import {
  useEffect,
  useMemo,
  useState,
}                      from 'react';
import {
  useDispatch,
  useSelector,
}                      from 'react-redux';

import { miscReduxData }   from '../app/slices/miscSlice';
import {
  logout,
  setDrawerIsOpen,
}                          from '../app/slices/profileSlice';
import { checkTokenValid } from '../app/utils/auth';
import { userRoleLabel }   from '../app/utils/helpers';

import {
  AccountMenu,
  Copyright,
  Logo,
} from './index';

const logoWidth = 240;
const drawerWidth = 240;
const toolbarHeight = 60;

const openedMixin = (theme) => {
  return {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  };
};

const closedMixin = (theme) => {
  return {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [ theme.breakpoints.up('sm') ]: { width: `calc(${theme.spacing(8)} + 1px)` },
  };
};

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => {
    return prop !== 'open';
  },
})(({ theme }) => {
  return {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  };
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => {
    return prop !== 'open';
  },
})(
  ({
     theme,
     open,
   }) => {
    return {
      position: 'relative',
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      overflowY: 'hidden',
      backgroundColor: 'white',
      height: '100vh',
      ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': {
          position: 'absolute',
          top: toolbarHeight + 'px',
          width: drawerWidth,
        },
      }),
      ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': {
          position: 'absolute',
          top: toolbarHeight + 'px',
          width: drawerWidth,
          backgroundColor: 'white',
          height: 'calc(100vh - 0px)',

        },
      }),
    };
  },
);

export const Layout = ({ children, leftMenu }) => {
  const miscData = useSelector(miscReduxData);
  const dispatch = useDispatch();
  const profile = useSelector((state) => {
    return state.profile;
  });
  const { drawerIsOpen: open } = profile;
  const [userRole, setUserRole] = useState('unknown role');

  const handleDrawer = () => {
    return () => {
      return dispatch(setDrawerIsOpen(!open));
    };
  };

  const AccountInfo = (props) => {
    return <Box align="right" sx={{ flexGrow: 1 }}>{props.children}</Box>;
  };

  const UserInfo = (props) => {
    return <Typography
      sx={{
        mr: 1,
        fontSize: '12px',
        textShadow: '.15em .15em 0.17em #000000',
      }}
    >{props.children}</Typography>;
  };

  const isLogged = useMemo(() => {
    return checkTokenValid();
  }, [profile]);

  useEffect(() => {
    if (!isLogged) {
      dispatch(logout());
    }

    const roles = profile?.authData?.userData?.roles;

    if (!roles) {
      return;
    }
    const roleLabel = userRoleLabel(miscData, roles);
    setUserRole(roleLabel);
  }, [profile]);

  return (
    <Box sx={{
      display: 'flex',
      overflowY: 'hidden',
      maxHeight: 'calc(100vh - 21px)',
    }}>
      <AppBar position="fixed" title={process.env.REACT_APP_NAME}>
        <Toolbar sx={{
          p: {
            sm: 0,
            xs: 0,
          },
        }}>
          <Logo open={!isLogged || open} accent={isLogged} width={logoWidth} />
          {isLogged && <>
            <AccountInfo>
              <UserInfo>{userRole}</UserInfo>
              <UserInfo>{profile?.authData?.userData?.name}</UserInfo>
            </AccountInfo>
            <AccountMenu />
          </>
          }

        </Toolbar>
      </AppBar>

      {isLogged && <Drawer variant="permanent" open={open}>
        <div>
          <IconButton onClick={handleDrawer()} sx={{ pl: '19px' }}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Divider />
        </div>
        <nav style={{ marginTop: '8px' }}>
          {leftMenu}
        </nav>
      </Drawer>}
      <Box component="main"
           sx={{
             flexGrow: 1,
             p: 3,
             mt: (toolbarHeight - 11) + 'px',
             height: 'calc(100vh - toolbarHeight)',
             overflow: 'auto',
           }}>
        {children}
        <Copyright
          scenario={isLogged && open ? 'open' : isLogged && !open ? 'closed' : 'loggedOut'} />
      </Box>
    </Box>
  );
};

Layout.propTypes = {
  children: PropTypes.element.isRequired,
  leftMenu: PropTypes.element.isRequired,
};
