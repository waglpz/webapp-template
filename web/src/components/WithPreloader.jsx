import { CircularProgress } from '@mui/material';
import { PropTypes }        from 'prop-types';
import {
  useEffect,
  useState,
}                           from 'react';

export const WithPreloader = ({ showPreloader }) => {
  const [preloaderShow, setPreloaderShow] = useState(false);

  useEffect(() => {
    setPreloaderShow(showPreloader);
  }, [showPreloader]);

  return (
    preloaderShow && <CircularProgress
      thickness={8}
      size={35}
      color={'error'}
      sx={{ ml: 2, mt: -.35 }}
    />

  );
};

WithPreloader.propTypes = { showPreloader: PropTypes.bool.isRequired };
