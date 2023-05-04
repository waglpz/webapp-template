import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {useSelector} from "react-redux";
import {
    AppBar,
    Box,
    Chip,
    Link,
    Toolbar,
    Typography,
} from '@mui/material';
import {makeStyles} from '@mui/styles';

import AccountMenu from './AccountMenu';
import Copyright from './Copyright';
import {useNavigate} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    lineHeight: '64px',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: 240,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: 240,
  },
  mainWrapper: {
    padding: '0 8px',
  },
  toolbar: theme.mixins.toolbar,
}));

const Layout = ({children}) => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.currentUser.currentUser);
  const classes = useStyles();

  useEffect(() => {
    const userIsSignedIn =!!(currentUser.email);
    if (userIsSignedIn) {
      return;
    }
    navigate('/login');
  }, []);

  return (
    <div className={classes.root}>
      <>
        <AppBar position="sticky" style={{zIndex: 1201}}
                title={process.env.REACT_APP_NAME}
        >
          <Toolbar>
            <Link className={classes.drawer}
                  href="/"
                  sx={{
                    fontWeight: 'bold',
                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                    m: 0,
                    p: 1.55,
                    ml: -3,
                    pl: 2.2,
                  }}
            >
              <Box
                component="img"
                sx={{p: 0, height: 24}}
                alt="Logo"
                src="/logo.png"
              />
              <Typography
                sx={{p: 0, mt: -1.25, ml: 12.25, color: '#ffffff', fontWeight: 'bolder', fontSize: 12}}>
                {process.env.REACT_APP_NAME}
              </Typography>
            </Link>
            {currentUser.userId && <>
                <Typography align="right" variant="subtitle2" right className={classes.title} sx={{ml: 2}}>
                  <Chip size="small" label={currentUser.name ?? '-'} color="info" variant="outlined"
                        sx={{mt: 0.25, mr: 1}}/>
                  <Chip size="small" label={currentUser.email ?? '-'} color="warning" variant="filled"/>
                </Typography>
                <AccountMenu currentUser={currentUser}/>
              </>
            }
          </Toolbar>
        </AppBar>
      </>

      <div className={classes.mainWrapper}>
        {children}
        <Box mt={2}>
          <Copyright/>
        </Box>
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Layout;
