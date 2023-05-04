import React from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';

import {
  Button,
  Typography,
} from '@mui/material';

import {
  miscReduxData,
  setGlobalAlertData
} from '../app/slices/miscSlice';

import ModalWrapper from './ModalWrapper'

const translate_map = {
  ok: 'OK',
};

const GlobalAlert = () => {
  const dispatch = useDispatch();
  const miscData = useSelector(miscReduxData);

  const onModalClosed = () => {
    dispatch(setGlobalAlertData({ show: false, title: '', subtitle: '' }));
  };

  return (
    <>
      {
        miscData && miscData.globalAlertData &&
        <ModalWrapper open={miscData.globalAlertData.show} onClose={onModalClosed}>
          <>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {miscData.globalAlertData.title}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {miscData.globalAlertData.subtitle}
            </Typography>

            <Button style={{ float: 'right' }} onClick={onModalClosed}>
              {translate_map.ok}
            </Button>
          </>
        </ModalWrapper>
      }
    </>
  );
};

export default GlobalAlert;
