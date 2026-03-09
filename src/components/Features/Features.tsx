import HubIcon from '@mui/icons-material/Hub';
import SecurityIcon from '@mui/icons-material/Security';
import BoltIcon from '@mui/icons-material/Bolt';
import InsightsIcon from '@mui/icons-material/Insights';
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
    icon: <SecurityIcon fontSize="large" />,
    title: 'Production-oriented',
    description:
      'Designed for reliability, clear request behavior, and maintainable service communication.',
  },
  {
    icon: <InsightsIcon fontSize="large" />,
    title: 'Future dashboard',
    description:
      'A separate admin dashboard with metrics and insights can later live on a dedicated subdomain.',
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
          A focused foundation for dependable HTTP communication between services, without turning a
          simple client into a complex platform.
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
