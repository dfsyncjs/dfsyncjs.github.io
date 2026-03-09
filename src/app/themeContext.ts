import { createContext } from 'react';

export const ThemeModeContext = createContext({
  toggleTheme: () => {},
  mode: 'light',
});
