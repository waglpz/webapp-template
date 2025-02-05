import {
  Box,
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Typography,
}                      from '@mui/material';
import PropTypes       from 'prop-types';
import {
  useEffect,
  useState,
}                      from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { routeAccessPermitted } from '../app/utils/routeAccessPermitted';

import { NavElement } from './NavElement';

const isPermitted = (navElementsProps) => {

  return navElementsProps.filter(({ route }) => {
    return routeAccessPermitted(route);
  }).length > 0;
};

export const NavCollapsed = ({
                               title,
                               subtitle,
                               navElementsProps,
                               parentActiveColor,
                               icon,
                               iconCallback,
                             }) => {
  const profile = useSelector((state) => {
    return state.profile;
  });
  const { drawerIsOpen } = profile;
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [childRouteActive, setChildRouteActive] = useState(false);

  useEffect(() => {
    const isChildActive = navElementsProps.filter(
      ({ route }) => {
        return location.pathname.indexOf(route) > -1;
      }).length > 0;
    setChildRouteActive(isChildActive);
    setMenuState(isChildActive);
  }, [location]);

  const setMenuState = (state) => {
    setOpen(state);
  };

  const onClickMenu = () => {
    setOpen(!open);
  };

  return (
    <>
      {isPermitted(navElementsProps) &&
        <>
          <ListItemButton title={title} selected={childRouteActive}
                          onClick={onClickMenu}
                          sx={drawerIsOpen ? {
                            m: 0,
                            p: 0,
                            pl: 1.5,
                            ...(childRouteActive ? {
                              borderRight: 9,
                              borderStyle: 'solid',
                              borderColor: parentActiveColor,
                            } : {}),
                          } : {
                            pl: 3,
                            ml: 0,
                            display: 'block',
                            fontSize: '28px',
                          }}>
            <Box sx={{ ...(drawerIsOpen ? { mt: -2.1 } : { ml: -.5, mt: 1 }) }}>
              {icon || iconCallback(childRouteActive ? parentActiveColor : null)}
            </Box>
            <ListItemText sx={{ ml: .5 }} primary={drawerIsOpen && <>
              <Typography
                sx={{
                  display: 'inline',
                  textShadow: '.1em .1em .01em #FFFFFF',
                }}
                component="span"
                color={childRouteActive ? parentActiveColor : null}
              >
                {title}
              </Typography>
            </>} secondary={drawerIsOpen && <><Typography
              sx={{
                display: 'inline',
                fontWeight: '399',
                textShadow: '.1em .1em .01em #FFFFFF',
              }}
              component="span"
              variant="subtitle2">{subtitle}</Typography>
            </>}/>
          </ListItemButton>
          {!open && <Divider sx={{
            boxShadow: 4,
            mb: 1,
          }}/>}
        </>
      }
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List sx={{
          p: 0,
          m: 0,
        }}>
          {navElementsProps && navElementsProps.map((options, i) => {
            return <NavElement key={i} {...options} />;
          })}
        </List>
      </Collapse>
      {open && <Divider sx={{
        boxShadow: 4,
        mb: 1,
      }}/>}
    </>
  );
};

NavCollapsed.propTypes = {
  navElementsProps: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  icon: PropTypes.object,
  iconCallback: PropTypes.func,
  parentActiveColor: PropTypes.string,
};
