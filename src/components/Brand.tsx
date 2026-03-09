import { Typography } from '@mui/material';

export function Brand() {
  return (
    <Typography
      component="a"
      href="/"
      sx={{
        textDecoration: 'none',
        color: 'inherit',
        fontWeight: 700,
      }}
    >
      dfsync
    </Typography>
  );
}
