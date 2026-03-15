import HubIcon from '@mui/icons-material/Hub';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import ReplayIcon from '@mui/icons-material/Replay';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import BoltIcon from '@mui/icons-material/Bolt';
import { Card, CardContent, Container, Grid, Stack, Typography } from '@mui/material';

const items = [
  {
    icon: <HubIcon fontSize="large" />,
    title: 'Service-to-service first',
    description:
      'Built for microservices, internal APIs, worker processes, and external integrations.',
  },
  {
    icon: <BoltIcon fontSize="large" />,
    title: 'Sensible defaults',
    description:
      'A clean, predictable HTTP client setup without repeating the same boilerplate in every project.',
  },
  {
    icon: <LockIcon fontSize="large" />,
    title: 'Auth support',
    description: 'Built-in support for bearer tokens, API keys.',
  },
  {
    icon: <ReplayIcon fontSize="large" />,
    title: 'Retry support',
    description: 'Supports configurable retry policies for transient failures.',
  },
  {
    icon: <DeviceHubIcon fontSize="large" />,
    title: 'Lifecycle hooks',
    description: 'Built-in request lifecycle hooks like beforeRequest, afterResponse, and onError.',
  },
  {
    icon: <SecurityIcon fontSize="large" />,
    title: 'Production-oriented',
    description:
      'Designed for reliability, clear request behavior, and maintainable service communication.',
  },
];

export const Features = () => {
  return (
    <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 12 } }}>
      <Stack spacing={2} sx={{ mb: 5 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
          Why dfsync
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 720 }}>
          A focused foundation for dependable HTTP communication between services — with sensible
          defaults, auth strategies, lifecycle hooks and retry support.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid size={{ xs: 12, sm: 6 }} key={item.title}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3.5 }}>
                <Stack spacing={2}>
                  {item.icon}
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography color="text.secondary">{item.description}</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
