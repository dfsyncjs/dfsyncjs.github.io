import HubIcon from '@mui/icons-material/Hub';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import LockIcon from '@mui/icons-material/Lock';
import ReplayIcon from '@mui/icons-material/Replay';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import InsightsIcon from '@mui/icons-material/Insights';
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
    description: 'Built-in retry policies with Retry-After support and full retry visibility..',
  },
  {
    icon: <DeviceHubIcon fontSize="large" />,
    title: 'Lifecycle hooks',
    description: 'Lifecycle hooks including beforeRequest, afterResponse, onError, and onRetry.',
  },
  {
    icon: <InsightsIcon fontSize="large" />,
    title: 'Observability',
    description: 'Built-in request visibility with timing, retry metadata, and lifecycle insights.',
  },
  {
    icon: <AutorenewIcon fontSize="large" />,
    title: 'Predictable lifecycle',
    description:
      'Every request follows a clear, controllable lifecycle with full visibility into execution and retries.',
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
          A lightweight HTTP client with a predictable request lifecycle, built-in retries, and
          request observability for service-to-service communication.
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
      <Typography variant="h5" sx={{ mt: 4 }}>
        Includes request timing, retry reasons, and stable request IDs across retries.
      </Typography>
    </Container>
  );
};
