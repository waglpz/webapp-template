import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
}                    from '@mui/material';
import { PropTypes } from 'prop-types';
import { useState }  from 'react';

import ModalWrapper from '../components/ModalWrapper';

const ModalDialogSetRoleInApp = ({
                                   onClose,
                                   roles,
                                 }) => {
  const [role, setRole] = useState('');

  function onSelectRole(event) {
    setRole(event.target.value);
  }

  function onConfirm() {
    onClose(role);
  }

  return (
    <>
      <ModalWrapper open={true}>
        <>
          <Typography variant="h6" component="h6">
            Auswahl der Rolle in der Anwendung
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Sie haben mehrere Rollen, wir bitten Sie eine bestimmte Rolle zu
            verwenden um Anwendung zu
            starten
          </Typography>
          <FormControl fullWidth sx={{ marginTop: 3 }}>
            <InputLabel id="admin-login-select-role-label">Rolle</InputLabel>
            <Select
              labelId="admin-login-select-role-label"
              id="admin-login-select-role"
              value={role}
              label="Rolle"
              onChange={onSelectRole}
            >
              {
                Object.values(roles).map((role) => {
                  return (
                    <MenuItem key={role.value}
                              value={role.value}
                              title={role.description}>
                      {role.label}
                    </MenuItem>
                  );
                })
              }
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ marginTop: 3 }}>
            <Button fullWidth sx={{}}
                    onClick={onConfirm}>
              Mit gewählter Rolle weiter
            </Button>
          </FormControl>
        </>
      </ModalWrapper>
    </>
  );
};

ModalDialogSetRoleInApp.propTypes = {
  roles: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ModalDialogSetRoleInApp;
