import React from 'react';
import PropTypes from "prop-types";
import {useDispatch} from 'react-redux';
import {
  Avatar,
  IconButton,
  ListItemButton,
  ListItemText,
  Menu,
} from '@mui/material';

import {logout} from '../app/slices/userSlice';

const translate_map = {
  sign_out: 'abmelden',
};

const AccountMenu = ({currentUser}) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
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
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <Avatar alt={currentUser.name} src={currentUser.picture}/>
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
        <ListItemButton onClick={handleLogout}>
          <ListItemText primary={currentUser.name} secondary={translate_map.sign_out}/>
        </ListItemButton>
      </Menu>
    </>
  );
};

AccountMenu.propTypes = {
  currentUser: PropTypes.object.isRequired,
};

export default AccountMenu;
