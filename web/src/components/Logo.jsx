import {
  Box,
  Typography,
  useTheme,
}                from '@mui/material';
import PropTypes from 'prop-types';

import { nameToAbbreviation } from '../app/utils/helpers';

export const Logo = ({ open = false, accent = true, width = 240, sx }) => {
  const theme = useTheme();
  const styleIfOpen = {
    pl: 2.5,
    display: 'flex',
    alignItems: 'center',
    textAlign: 'left',
    width: open ? width : `calc(${theme.spacing(8)} + 2px)`,
    pt: .75,
    height: { sm: 64, xs: 56 },
  };

  return (
    <Box sx={{ ...(accent ? { backgroundColor: 'rgba(0, 0, 0, 0.25)' } : {}) }}>
      <Box
        sx={open ? styleIfOpen : { ...styleIfOpen, textAlign: 'center' }}
        component="a"
        href="/"
      >
        <Box>
          <Typography
            sx={{
              pl: .25,
              whiteSpace: 'nowrap',
              overflow: 'clip',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              fontSize: '12px',
              textShadow: '.1em .1em 0.15em #000000',
              ...sx,
            }}>
            {open ? process.env.REACT_APP_NAME : nameToAbbreviation(process.env.REACT_APP_NAME)}
          </Typography>
          <Box
            component="img"
            sx={{
              maxHeight: 64 / 3.2,
              m: 'auto',
            }}
            src={open ? '/logo.png' : '/logo-drawer-short.png'}
          />
        </Box>
      </Box>
    </Box>
  );
};

Logo.propTypes = {
  open: PropTypes.bool.isRequired,
  accent: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  sx: PropTypes.object,
};
