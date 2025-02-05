import { List }      from '@mui/material';
import { PropTypes } from 'prop-types';

export const LeftMenu = ({ children }) => {
  return (
    <List>
      {children}
    </List>
  );
};

LeftMenu.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
