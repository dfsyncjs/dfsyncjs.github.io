import { useEffect, useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider, Box } from '@mui/material';
import type { PaletteMode } from '@mui/material';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Footer } from './components/Footer';
import { getTheme } from './theme';

const STORAGE_KEY = 'dfsync-theme-mode';

function getInitialMode(): PaletteMode {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const [mode, setMode] = useState<PaletteMode>(getInitialMode);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const theme = useMemo(() => getTheme(mode), [mode]);

  const handleToggleMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        sx={{
          minHeight: '100vh',
          background:
            mode === 'dark'
              ? 'radial-gradient(circle at top, rgba(56,189,248,0.12), transparent 30%)'
              : 'radial-gradient(circle at top, rgba(37,99,235,0.10), transparent 30%)',
        }}
      >
        <Header mode={mode} onToggleMode={handleToggleMode} />
        <Hero />
        <Features />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
