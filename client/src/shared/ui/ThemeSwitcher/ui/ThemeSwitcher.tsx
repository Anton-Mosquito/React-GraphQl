import Brightness4Icon from '@mui/icons-material/Brightness4'; // Місяць
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { IconButton } from '@mui/material';
import { useTheme } from '@/shared/lib/hooks/useTheme/useTheme';
import { Theme } from '@/shared/const/theme';

interface ThemeSwitcherProps {
  className?: string;
}

export const ThemeSwitcher = ({ className }: ThemeSwitcherProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <IconButton onClick={() => toggleTheme()} color="inherit" className={className}>
      {theme === Theme.DARK ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};
