import {
  Box,
  Modal,
}                from '@mui/material';
import PropTypes from 'prop-types';

const styleDefault = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const ModalWrapper = ({
                               children,
                               style,
                               open = false,
                               onClose = () => {
                               },
                             }) => {
  const styleCurrent = {...styleDefault, ...style};
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={styleCurrent}>{children}</Box>
    </Modal>
  );
};

ModalWrapper.propTypes = {
  children: PropTypes.element.isRequired,
  style: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
