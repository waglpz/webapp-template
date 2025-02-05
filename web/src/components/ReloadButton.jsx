import RefreshIcon    from '@mui/icons-material/Refresh';
import { IconButton } from '@mui/material';

export const ReloadButton = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <IconButton onClick={handleReload} aria-label="reload">
      <RefreshIcon />
    </IconButton>
  );
};
