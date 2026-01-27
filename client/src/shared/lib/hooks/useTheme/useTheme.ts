import { useContext } from 'react';

import { Theme } from '../../../const/theme';
import { ThemeContext } from '../../context/ThemeContext';

interface UseThemeResult {
  toggleTheme: (saveAction?: (theme: Theme) => void) => void;
  theme: Theme;
}

export const useTheme = (): UseThemeResult => {
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = (saveAction?: (theme: Theme) => void): void => {
    let newTheme: Theme;
    switch (theme) {
      case Theme.DARK:
        newTheme = Theme.LIGHT;
        break;
      case Theme.LIGHT:
        newTheme = Theme.DARK;
        break;
      default:
        newTheme = Theme.LIGHT;
        break;
    }

    setTheme?.(newTheme);
    saveAction?.(newTheme);
  };

  return {
    theme: theme ?? Theme.LIGHT,
    toggleTheme,
  };
};
