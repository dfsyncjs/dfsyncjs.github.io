import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      gap={3}
    >
      <Typography variant="h2">404</Typography>

      <Typography color="text.secondary">Page not found</Typography>

      <Button variant="contained" component={RouterLink} to="/">
        Go home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
