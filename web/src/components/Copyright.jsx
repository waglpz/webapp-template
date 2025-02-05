import { Box }   from '@mui/material';
import PropTypes from 'prop-types';

const style = {
  fontSize: 10,
  fontWeight: 'bold',
  display: 'flex',
  minWidth: '100%',
  p: 0,
  m: 0,
  position: 'fixed',
  bottom: 0,
  height: 21,
  flexGrow: 1,
};

export const Copyright = ({ scenario }) => {
  let mr = 0;
  if (scenario === 'loggedOut') {
    mr = 3.9;
  } else if (scenario === 'open') {
    mr = 33.7;
  } else if (scenario === 'closed') {
    mr = 11.75;
  }
  return (<Box sx={style}>
    <Box sx={{ flexGrow: 0, bgcolor: 'white', ml: -33, width: '239px' }}></Box>
    <Box sx={{ pt: .36, flexGrow: 1, textAlign: 'right', mr }}>
      {'Copyright © Waglpz '}
      {process.env.REACT_APP_NAME}
      {' v'}
      {process.env.REACT_APP_VERSION}
      {'  '}
      {new Date().getFullYear()}
    </Box>
  </Box>);
};

Copyright.propTypes = { scenario: PropTypes.oneOf(['closed', 'open', 'loggedOut']).isRequired };
