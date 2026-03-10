import HubIcon from '@mui/icons-material/Hub';
import SecurityIcon from '@mui/icons-material/Security';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
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
    icon: <VpnKeyIcon fontSize="large" />,
    title: 'Auth & lifecycle hooks',
    description:
      'Built-in support for bearer tokens, API keys, and request lifecycle hooks like beforeRequest, afterResponse, and onError.',
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
          defaults, auth strategies, and lifecycle hooks.
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
