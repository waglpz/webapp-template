import {
  Box,
  LinearProgress,
}                from '@mui/material';
import PropTypes from 'prop-types';

import { axiosInstance }     from '../app/axiosInstance';
import { useAxiosPreloader } from '../app/hooks/useAxiosPreloader'; // Adjust the import path accordingly


export const PreloaderLinear = (props) => {
  const { progress, activePreloader } = useAxiosPreloader(axiosInstance);

  return (
    <Box sx={{ width: '100%', height: '7px' }}>
      {activePreloader && (
        <LinearProgress
          {...props}
          value={progress}
          sx={{ height: '7px' }}
        />
      )}
    </Box>
  );
};

PreloaderLinear.propTypes = {
  props: PropTypes.shape({
    color: PropTypes.oneOf(['primary', 'secondary', 'error', 'info', 'success', 'warning', 'inherit']),
    classes: PropTypes.any,
    sx: PropTypes.object,
    value: PropTypes.number,
    valueBuffer: PropTypes.number,
    variant: PropTypes.oneOf(['determinate', 'indeterminate', 'buffer', 'query']),
  }),
};
