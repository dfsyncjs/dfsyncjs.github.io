import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { routes } from './app/router';

const Loader = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress />
    </Box>
  );
};

export default function App() {
  const element = useRoutes(routes);

  return <Suspense fallback={<Loader />}>{element}</Suspense>;
}
