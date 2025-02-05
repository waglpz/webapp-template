import { Box }   from '@mui/material';
import Grow      from '@mui/material/Grow';
import PropTypes from 'prop-types';

const style = {
  color: 'red',
  fontWeight: 500,
  fontSize: 14,
  lineHeight: 1.2,
  marginTop: -7,
  marginLeft: 8,
};

const growTimeout = 777;

export const FieldError = ({
                             message,
                             show,
                           }) => {

  const splited = message.split('\n');
  if (splited.length > 1) {
    message = splited.map((s, i) => {
      const br = i < (splited.length - 1) ? <br /> : null;
      return (<><span key={i}>{s}</span>{br}</>);
    });
  }
  return (
    <Box sx={{ height: 24 }}>
      <Grow
        in={show}
        style={{ transformOrigin: '1000 0 0' }}
        timeout={growTimeout}
      >
        <Box style={style}>
          {show && message}
        </Box>
      </Grow>
    </Box>
  );
};

FieldError.propTypes = {
  message: PropTypes.string,
  show: PropTypes.bool.isRequired,
};
