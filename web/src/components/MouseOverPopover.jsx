import * as React from 'react';
import HelpIcon from '@mui/icons-material/Help';
import Popover from '@mui/material/Popover';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

export default function MouseOverPopover ({ initiator, content }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Typography
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        {initiator}
      </Typography>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none'
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>{content}</Typography>
      </Popover>
    </div>
  );
}

MouseOverPopover.defaultProps = {
  content: 'default',
  initiator: <HelpIcon sx={{ fontSize: 'medium' }} style={{ display: 'block' }} color="black"/>
};

MouseOverPopover.propTypes = {
  content: PropTypes.string.isRequired,
  initiator: PropTypes.any
};
