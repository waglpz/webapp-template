import {
  Box,
  ListItemButton,
  ListItemText,
  Typography,
}                      from '@mui/material';
import { PropTypes }   from 'prop-types';
import { useSelector } from 'react-redux';
import {
  NavLink,
  useLocation,
}                      from 'react-router-dom';

import { routeAccessPermitted } from '../app/utils/routeAccessPermitted';

const subNavStyle = {
  display: 'inline',
  lineHeight: 1,
  fontSize: '14px',
  textShadow: '.1em .1em .01em #FFFFFF',
};
const selected = (isActive, route, location) => {

  return isActive ? true : location.pathname.indexOf(route) > -1;
};


const styleForOpened = (active, parentActiveColor) => {
  return {
    ...(active ? {
      borderRight: 4,
      borderColor: parentActiveColor,
    } : {}),
    m: 0,
    p: 0,
    pl: 2.75,
  };
};

const styleForClosed = (active, parentActiveColor) => {
  return {
    ...(active ? {
      borderRight: 4,
      borderColor: parentActiveColor,
    } : {}),
    p: 2,
    pt: 3,
    pl: 3,
    display: 'block',
  };
};

const NavElement = ({
                      route,
                      title,
                      tooltip,
                      subtitle,
                      icon,
                      parentSx,
                      parentActiveColor,
                      iconCallback = () => {
                        return null;
                      },
                    }) => {
  const profile = useSelector((state) => {
    return state.profile;
  });
  const { drawerIsOpen } = profile;
  const location = useLocation();

  return (
    routeAccessPermitted(route) && <NavLink
      end
      reloadDocument={route === location.pathname}
      to={route}
      children={({ isActive }) => {
        const active = selected(isActive, route, location);
        return (
          <ListItemButton selected={active} title={tooltip}
                          sx={drawerIsOpen ? styleForOpened(active, parentActiveColor) : styleForClosed(active, parentActiveColor)}>
            <Box sx={{ ...(drawerIsOpen ? { mt: -1.75 } : { ml: -.5 }) }}>
              {icon || iconCallback(active ? parentActiveColor : (theme) => {
                return theme.palette.text.primary;
              })}
            </Box>
            <ListItemText
              sx={{ ml: .5 }}
              primary={drawerIsOpen && <>
                <Typography sx={{ ...subNavStyle, ...parentSx }}
                            component="span"
                            color={active ? parentActiveColor : (theme) => {
                              return theme.palette.text.primary;
                            }}>
                  {title}
                </Typography>
              </>}
              secondary={drawerIsOpen && <>
                <Typography sx={{
                  ...subNavStyle,
                  fontWeight: '398',
                  fontSize: '12px',
                }}
                            component="span"
                            variant="subtitle2">
                  {subtitle}
                </Typography>
              </>} />
          </ListItemButton>
        );
      }} />
  );
};

NavElement.propTypes = {
  route: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
  subtitle: PropTypes.string,
  icon: PropTypes.object,
  iconCallback: PropTypes.func,
  parentSx: PropTypes.object,
  parentActiveColor: PropTypes.string,
};
export { NavElement };
