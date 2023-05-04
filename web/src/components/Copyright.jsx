import React from 'react';
import { Typography } from '@mui/material';

const Copyright = () => (
  <Typography variant="body2" color="textSecondary" align="center">
    {'Copyright © Qasa '}
    {process.env.REACT_APP_NAME}
    {' v'}
    {process.env.REACT_APP_VERSION}
    {'  '}
    {new Date().getFullYear()}
  </Typography>
);

export default Copyright;
