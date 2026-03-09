import { Typography, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const Brand = () => {
  return (
    <Box
      component={RouterLink}
      to="/"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <Box
        component="img"
        src="/assets/logo.svg"
        alt="dfsync"
        sx={{
          width: 28,
          height: 28,
          borderRadius: '4px',
          backgroundColor: '#ffffff',
          padding: '2px',
          border: '1px solid transparent',
          borderColor: 'divider',
        }}
      />
      <Typography
        variant="h6"
        sx={{ display: 'flex', textDecoration: 'none', color: 'inherit', fontWeight: 700 }}
      >
        dfsync
      </Typography>
    </Box>
  );
};
