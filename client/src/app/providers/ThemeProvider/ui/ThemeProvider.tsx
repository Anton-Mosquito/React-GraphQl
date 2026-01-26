import { type ReactNode, useMemo, useState, useEffect } from 'react';

import { LOCAL_STORAGE_THEME_KEY } from '@/shared/const/localStorage';
import { Theme } from '@/shared/const/theme';
import { ThemeContext } from '@/shared/lib/context/ThemeContext';

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: Theme;
}

const fallbackTheme = (localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as Theme) ?? Theme.LIGHT;

const ThemeProvider = ({ children, initialTheme }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(initialTheme ?? fallbackTheme ?? Theme.LIGHT);
  const defaultProps = useMemo(() => ({ theme, setTheme }), [theme]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
  }, [theme]);

  return <ThemeContext.Provider value={defaultProps}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
