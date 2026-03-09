import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Button, Chip, Container, Stack, Typography } from '@mui/material';
import { InstallCommand } from '../InstallCommand/InstallCommand';

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
              Reliable HTTP communication for modern services.
            </Typography>

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
              dfsync provides a unified HTTP client with sensible defaults for service-to-service
              communication across microservices, internal APIs, workers, and external integrations.
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
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
              variant="outlined"
              size="medium"
              href="https://github.com/dfsyncjs/dfsync/blob/main/packages/client/README.md"
              target="_blank"
              rel="noreferrer"
              endIcon={<OpenInNewIcon />}
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
              borderRadius: 4,
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
});

const users = await client.get("/users");`}
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};
