import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ListIcon from '@mui/icons-material/List';
import { Box, Button, Chip, Container, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { InstallCommand } from '../InstallCommand/InstallCommand';
import { ProjectBadges } from '../ProjectBadges/ProjectBadges.tsx';
import { createTrackedLinkHandler } from '../../services/analytics';

export const Hero = () => {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 2, md: 4 },
        background: 'radial-gradient(circle at top, rgba(56,189,248,0.15), transparent 40%)',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4} alignItems="flex-start">
          <Chip label="Open-source toolkit for backend communication" color="primary" />

          <Box>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4.5rem' },
                lineHeight: 1.05,
                maxWidth: 900,
                textWrap: 'wrap',
              }}
            >
              Reliable toolkit for service-to-service communication
            </Typography>
            <Chip
              label="Built for microservices, internal APIs, integrations, and background workers"
              color="primary"
              variant="outlined"
              sx={{ mt: 1, mb: 1, display: { xs: 'none', sm: 'inline-flex' } }}
            />
            <Chip
              label="Built for modern backend systems"
              color="primary"
              variant="outlined"
              sx={{ mt: 1, mb: 1, display: { xs: 'inline-flex', sm: 'none' } }}
            />

            <ProjectBadges />

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                mt: 3,
                maxWidth: 760,
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              The first package, <strong>@dfsync/client</strong>, is a lightweight HTTP client built
              for reliable communication with retries, hooks, response validation, idempotency keys,
              and built-in request observability in Node.js.
            </Typography>
          </Box>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ width: { xs: '100%', md: 'auto' } }}
          >
            <Button
              fullWidth
              variant="contained"
              size="medium"
              href="https://www.npmjs.com/package/@dfsync/client"
              target="_blank"
              rel="noreferrer"
              endIcon={<OpenInNewIcon />}
              onClick={createTrackedLinkHandler({
                params: {
                  cta_name: 'npm',
                  location: 'hero',
                  label: 'View on npm',
                  link_url: 'https://www.npmjs.com/package/@dfsync/client',
                },
              })}
            >
              View on npm
            </Button>
            <Button
              fullWidth
              component={RouterLink}
              variant="outlined"
              size="medium"
              to="/docs/client"
              startIcon={<ListIcon />}
              onClick={createTrackedLinkHandler({
                params: {
                  cta_name: 'docs',
                  location: 'hero',
                  label: 'Documentation',
                  link_url: '/docs/client',
                },
              })}
            >
              Documentation
            </Button>
          </Stack>

          <InstallCommand />

          <Box
            sx={{
              mt: 3,
              width: '100%',
              p: { xs: 3, md: 4 },
              borderRadius: 1,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              overflowX: 'auto',
            }}
          >
            <Typography
              component="pre"
              sx={{
                m: 0,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: 14,
                lineHeight: 1.7,
                color: 'text.primary',
              }}
            >
              {`import { createClient } from '@dfsync/client';

const client = createClient({
  baseUrl: 'https://api.example.com',
  validateResponse(data) {
    return typeof data === 'object' && data !== null;
  },
  retry: { attempts: 2, retryOn: ['5xx', '429'] },
  hooks: {
    onRetry({ requestId, retryReason, retryDelayMs }) {
      console.log(requestId, retryReason, retryDelayMs);
    },
  },
});
`}
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};
