import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Button            from '@mui/material/Button';
import ButtonGroup       from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow              from '@mui/material/Grow';
import Paper             from '@mui/material/Paper';
import Popper            from '@mui/material/Popper';
import PropTypes         from 'prop-types';
import {
  Fragment,
  useEffect,
  useRef,
  useState,
}                        from 'react';

export function SplitButton({
                              label,
                              buttonOptions,
                            }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState(false);
  const anchorRef = useRef(null);

  useEffect(() => {
    buttonOptions.sort((a, b) => {
      return (a.disabled ? 1 : 0) > (b.disabled ? 1 : 0);
    });
    setOptions(buttonOptions);
  }, [buttonOptions]);

  const handleMenuItemClick = (event, index, onClick) => {
    setOpen(false);
    onClick();
  };

  const handleToggle = () => {
    setOpen((prevOpen) => {
      return !prevOpen;
    });
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <Fragment>
      <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button"
                   disabled={open}>
        <Button
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label=""
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          {label}
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{ zIndex: 1 }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({
            TransitionProps,
            placement,
          }) => {
          return (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement !== 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper sx={{ marginRight: 2 }}>
                <ClickAwayListener onClickAway={handleClose}>
                  <ButtonGroup sx={{
                    boxShadow: 5,
                    p: 0,
                    m: 0,
                    marginTop: -8,
                    background: 'transparent',
                  }}
                               orientation="vertical"
                               aria-label="vertical outlined button group"
                  >
                    {options.map((option, index) => {
                      return (
                        <Button variant="contained"
                                style={{ justifyContent: 'flex-start' }}
                                key={option.label}
                                disabled={option.disabled}
                                onClick={(event) => {
                                  return handleMenuItemClick(event, index, option.onClick);
                                }}
                        >
                          {option.icon}&nbsp;{option.label}
                        </Button>
                      );
                    })}
                  </ButtonGroup>
                </ClickAwayListener>
              </Paper>
            </Grow>
          );
        }}
      </Popper>
    </Fragment>
  );
}

SplitButton.propTypes = {
  buttonOptions: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
};
