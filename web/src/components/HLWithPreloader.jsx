import {
  Box,
  CircularProgress,
  Typography,
}                    from '@mui/material';
import { PropTypes } from 'prop-types';
import {
  useEffect,
  useState,
}                    from 'react';

const HLWithPreloader = ({
                           showPreloader,
                           text,
                         }) => {
  const [preloaderShow, setPreloaderShow] = useState(false);
  const [hlText, setHlText] = useState('');

  useEffect(() => {
    setPreloaderShow(showPreloader);
    setHlText(text);

  }, [showPreloader, text]);

  return (
    <Typography variant="h6" component="h6">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'left',
          p: 0,
          m: 2.5,
          bgcolor: 'transparent',
        }}
      >
        {hlText}
        {
          preloaderShow && <CircularProgress
            thickness={8}
            size={35}
            color={'error'}
            sx={{
              ml: 2,
              mt: -.35,
            }}
          />
        }
      </Box>
    </Typography>
  );
};

HLWithPreloader.propTypes = {
  text: PropTypes.string.isRequired,
  showPreloader: PropTypes.bool.isRequired,
};
export { HLWithPreloader };
