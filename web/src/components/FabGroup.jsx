import {
  Fab as MFab,
  styled,
}                from '@mui/material';
import PropTypes from 'prop-types';

export const StyledFab = styled(MFab)(({ theme, t, r, b, l }) => {
  return {
    position: 'fixed',
    bottom: b ? theme.spacing(b) : 'auto',
    top: t ? theme.spacing(t) : 'auto',
    left: l ? theme.spacing(l) : 'auto',
    right: r ? theme.spacing(r) : 'auto',
    zIndex: 1000, // Adjust the z-index as needed to make sure the FAB appears above other content
  };
});
const defaultPadding = 8;

export const FabGroup = ({ horizontal = false, config }) => {
  const flow = horizontal ? { b: defaultPadding, l: 1 } : {
    r: defaultPadding,
    b: null,
  };

  return config.map((item, index) => {
    if (horizontal) {
      flow.l += defaultPadding;
    } else {
      flow.b += defaultPadding;
    }
    const props = { ...item, ...flow };

    return <StyledFab key={index} {...props}>
      {item.label}
    </StyledFab>;
  });
};

FabGroup.propTypes = {
  config: PropTypes.arrayOf('object').isRequired,
  horizontal: PropTypes.bool,
};
