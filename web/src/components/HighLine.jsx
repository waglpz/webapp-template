import {
  Box,
  Typography,
}                    from '@mui/material';
import { PropTypes } from 'prop-types';
import {
  useEffect,
  useState,
}                    from 'react';

const HighLine = ({
                    text,
                    children,
                  }) => {
  const [hlText, setHlText] = useState('');

  useEffect(() => {
    setHlText(text);
  }, [text]);

  return (
    <Typography variant="h6" component="h6">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'left',
          p: 0,
          m: 1.5,
          ml: .25,
          textShadow: '.095em .095em .09em #BBBBBB',
          bgcolor: 'transparent',
        }}
      >
        <>
          {hlText}
          {children}
        </>
      </Box>
    </Typography>
  );
};

HighLine.propTypes = {
  children: PropTypes.object,
  text: PropTypes.string.isRequired,
};
export { HighLine };
