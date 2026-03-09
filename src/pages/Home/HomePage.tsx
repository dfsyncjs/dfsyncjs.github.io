import { useContext } from 'react';
import { Box } from '@mui/material';
import { Header, Hero, Features, Footer } from '../../components';
import { ThemeModeContext } from '../../app/themeContext';

const HomePage = () => {
  const { mode } = useContext(ThemeModeContext);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          mode === 'dark'
            ? 'radial-gradient(circle at top, rgba(56,189,248,0.12), transparent 30%)'
            : 'radial-gradient(circle at top, rgba(37,99,235,0.10), transparent 30%)',
      }}
    >
      <Header />
      <Hero />
      <Features />
      <Footer />
    </Box>
  );
};

export default HomePage;
