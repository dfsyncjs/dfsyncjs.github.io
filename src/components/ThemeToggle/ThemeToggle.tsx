import { useContext } from 'react';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { IconButton } from '@mui/material';
import { ThemeModeContext } from '../../app/themeContext';

export const ThemeToggle = () => {
  const { toggleTheme, mode } = useContext(ThemeModeContext);

  return (
    <IconButton color="inherit" onClick={toggleTheme} aria-label="toggle theme">
      {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
};
