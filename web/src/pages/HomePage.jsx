import { Box }         from '@mui/material';
import { useSelector } from 'react-redux';

const boxStyle = {
  display: 'flexGrow',
  flexWrap: 'wrap',
  alignContent: 'flex-start',
  justifyContent: 'center',
  p: 1,
  m: 1,
  bgcolor: 'transparent',
  fontSize: 74,
  minHeight: '728px',
  color: '#fcfcfc',
  textAlign: 'center',
  textShadow: '.05em .05em .15em #777777',
};

export const HomePage = () => {
  const profile = useSelector((state) => {
    return state.profile;
  });

  return (
    <>
      {profile.authData &&
        <Box sx={boxStyle}>
          {process.env.REACT_APP_NAME}
        </Box>
      }
    </>
  );
};
