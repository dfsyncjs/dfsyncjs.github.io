import { Container, Grid, Typography, Paper } from '@mui/material';
const items = [
  {
    title: 'Repeated boilerplate',
    description: 'Every project reimplements retry, auth, and error handling differently.',
  },
  {
    title: 'Unpredictable behavior',
    description: 'Request flows vary across services, making debugging and maintenance harder.',
  },
  {
    title: 'Lack of control',
    description: 'No unified way to control retries, cancellation, and request lifecycle.',
  },
];

export function Problem() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        What problem it solves
      </Typography>

      <Typography color="text.secondary" sx={{ maxWidth: 720, mb: 4 }}>
        In most projects, HTTP clients are rebuilt again and again — with slightly different retry
        logic, error handling, and no visibility into what actually happened.
        <br />
        <br />
        <strong>@dfsync/client</strong> provides a predictable, observable, and reusable request
        lifecycle out of the box for service-to-service communication.
      </Typography>

      <Grid container spacing={3}>
        {items.map(({ title, description }) => (
          <Grid size={{ xs: 12, md: 4 }} key={title}>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 3,
                height: '100%',
              }}
            >
              <Typography fontWeight={600} gutterBottom>
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
