import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ListIcon from '@mui/icons-material/List';
import { Box, Button, Chip, Container, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { InstallCommand } from '../InstallCommand/InstallCommand';
import { ProjectBadges } from '../ProjectBadges/ProjectBadges.tsx';

export const Hero = () => {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 10, md: 14 },
        background: 'radial-gradient(circle at top, rgba(56,189,248,0.15), transparent 40%)',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4} alignItems="flex-start">
          <Chip label="Open-source TypeScript HTTP library" color="primary" />

          <Box>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4.5rem' },
                lineHeight: 1.05,
                maxWidth: 900,
              }}
            >
              Reliable HTTP communication for Node.js environments.
            </Typography>

            <Chip
              label="NEW · Auth & Lifecycle Hooks & Retry"
              color="primary"
              variant="outlined"
              sx={{
                mt: 2,
                fontWeight: 500,
              }}
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
              dfsync - a lightweight & reliable HTTP client for service-to-service communication
              across services in Node.js with retry, auth and lifecycle hooks.
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
            >
              View on npm
            </Button>
            <Button
              fullWidth
              component={RouterLink}
              variant="outlined"
              size="medium"
              to="/docs"
              startIcon={<ListIcon />}
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
              bgcolor: 'background.paper',
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
              {`import { createClient } from "@dfsync/client";

const client = createClient({
  baseURL: "https://api.example.com",
  retry: { 
    attempts: 3,
    backoff: 'exponential'
  },
});

const users = await client.get("/users");`}
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};
