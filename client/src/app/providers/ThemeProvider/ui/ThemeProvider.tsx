import useMediaQuery from '@mui/material/useMediaQuery';
import { type ReactNode, useMemo, useState, useEffect } from 'react';

import { LOCAL_STORAGE_THEME_KEY } from '@/shared/const/localStorage';
import { Theme } from '@/shared/const/theme';
import { ThemeContext } from '@/shared/lib/context/ThemeContext';
import { saveToStorage, getFromStorage } from '@/shared/utils/localStorage';

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: Theme;
}

const ThemeProvider = ({ children, initialTheme }: ThemeProviderProps) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = getFromStorage<Theme>(LOCAL_STORAGE_THEME_KEY);
    if (savedTheme) return savedTheme;
    if (initialTheme) return initialTheme;
    return prefersDarkMode ? Theme.DARK : Theme.LIGHT;
  });
  const defaultProps = useMemo(() => ({ theme, setTheme }), [theme]);

  useEffect(() => {
    saveToStorage(LOCAL_STORAGE_THEME_KEY, theme);
  }, [theme]);

  return <ThemeContext.Provider value={defaultProps}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
