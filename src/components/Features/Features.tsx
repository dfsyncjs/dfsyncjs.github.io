import HubIcon from '@mui/icons-material/Hub';
import AutorenewIcon from '@mui/icons-material/Autorenew';
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
    description: 'Built-in support for bearer tokens, API keys, and custom auth flows.',
  },
  {
    icon: <ReplayIcon fontSize="large" />,
    title: 'Retry support',
    description: 'Built-in configurable retry policies for transient failures.',
  },
  {
    icon: <DeviceHubIcon fontSize="large" />,
    title: 'Lifecycle hooks',
    description: 'Built-in request lifecycle hooks like beforeRequest, afterResponse, and onError.',
  },
  {
    icon: <AutorenewIcon fontSize="large" />,
    title: 'Predictable lifecycle',
    description: 'Every request follows a clear and controllable lifecycle.',
  },
];

export const Features = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Stack spacing={2} sx={{ mb: 5 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
          Why @dfsync/client
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 720 }}>
          A lightweight HTTP client with a predictable request lifecycle for service-to-service
          communication with sensible defaults, authentication strategies, lifecycle hooks, and
          retry support.
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
