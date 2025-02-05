import { Logout }   from '@mui/icons-material';
import {
  Avatar,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
}                   from '@mui/material';
import { useState } from 'react';
import {
  useDispatch,
  useSelector,
}                   from 'react-redux';

import { logout } from '../app/slices/profileSlice';

const translate_map = { sign_out: 'abmelden' };

export const AccountMenu = () => {
  const profile = useSelector((state) => {
    return state.profile;
  });
  const {
    userData: {
      email,
      name: displayName,
      picture: avatarUrl,
    },
  } = profile.authData;
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
  };

  return (
    <>
      <IconButton
        sx={{ pr: 1.5 }}
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
      >
        <Avatar alt={displayName} src={avatarUrl} />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={handleClose}
      >
        <ListItemText sx={{
          mt: -1,
          pl: 2,
          pr: 2,
          pt: 2,
        }}
                      primary={displayName}
                      secondary={email} />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          {translate_map.sign_out}
        </MenuItem>
      </Menu>
    </>
  );
};
