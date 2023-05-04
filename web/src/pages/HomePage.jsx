import React from 'react';

import {Box} from '@mui/material';

const boxStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  alignContent: 'flex-start',
  justifyContent: 'center',
  p: 1, m: 1,
  bgcolor: 'transparent',
};

const HomePage = () => {

  return (
    <>
      <Box sx={boxStyle}>
        Coming soon...
      </Box>
    </>
  );
};

export default HomePage;
