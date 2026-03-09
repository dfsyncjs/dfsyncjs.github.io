import { createTheme } from '@mui/material/styles';
import type { PaletteMode } from '@mui/material';

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#7dd3fc' : '#0f172a',
      },
      secondary: {
        main: mode === 'dark' ? '#38bdf8' : '#2563eb',
      },
      background: {
        default: mode === 'dark' ? '#0b1120' : '#f8fafc',
        paper: mode === 'dark' ? '#111827' : '#ffffff',
      },
    },
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily: [
        'Inter',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'sans-serif',
      ].join(','),
      h1: {
        fontWeight: 800,
        letterSpacing: '-0.04em',
      },
      h2: {
        fontWeight: 700,
        letterSpacing: '-0.03em',
      },
      h6: {
        fontWeight: 700,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            paddingInline: 18,
            paddingBlock: 10,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            border: '1px solid',
            borderColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)',
            boxShadow:
              mode === 'dark' ? '0 10px 30px rgba(0,0,0,0.25)' : '0 10px 30px rgba(15,23,42,0.06)',
          },
        },
      },
    },
  });
