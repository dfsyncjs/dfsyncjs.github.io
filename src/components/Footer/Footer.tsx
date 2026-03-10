import { Box, Container, Link, Stack, Typography } from '@mui/material';

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: '1px solid',
        borderColor: 'divider',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} dfsync
          </Typography>

          <Stack direction="row" spacing={2}>
            <Link
              href="https://www.npmjs.com/package/@dfsync/client"
              target="_blank"
              rel="noreferrer"
              underline="hover"
            >
              npm
            </Link>
            <Link
              href="https://github.com/dfsyncjs/dfsync/tree/main/packages/client"
              target="_blank"
              rel="noreferrer"
              underline="hover"
            >
              GitHub
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
