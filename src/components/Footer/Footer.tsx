import { Box, Container, Link, Stack, Typography } from '@mui/material';
import { createTrackedLinkHandler } from '../../services/analytics';

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
              href="https://github.com/dfsyncjs/dfsync"
              target="_blank"
              rel="noreferrer"
              underline="hover"
              onClick={createTrackedLinkHandler({
                params: {
                  cta_name: 'github',
                  location: 'footer',
                  label: 'GitHub',
                  link_url: 'https://github.com/dfsyncjs/dfsync',
                },
              })}
            >
              GitHub
            </Link>
            <Link
              href="https://www.linkedin.com/company/dfsync/"
              target="_blank"
              rel="noreferrer"
              underline="hover"
              onClick={createTrackedLinkHandler({
                params: {
                  cta_name: 'linkedIn',
                  location: 'footer',
                  label: 'LinkedIn',
                  link_url: 'https://www.linkedin.com/company/dfsync/',
                },
              })}
            >
              LinkedIn
            </Link>
            <Link
              href="https://x.com/dfsyncjs"
              target="_blank"
              rel="noreferrer"
              underline="hover"
              onClick={createTrackedLinkHandler({
                params: {
                  cta_name: 'x',
                  location: 'footer',
                  label: 'X (Twitter)',
                  link_url: 'https://x.com/dfsyncjs',
                },
              })}
            >
              X (Twitter)
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
