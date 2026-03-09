import { Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const Brand = () => {
  return (
    <Typography
      component={RouterLink}
      to="/"
      sx={{
        textDecoration: 'none',
        color: 'inherit',
        fontWeight: 700,
      }}
    >
      dfsync
    </Typography>
  );
};
