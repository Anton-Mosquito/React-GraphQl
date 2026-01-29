import MenuIcon from '@mui/icons-material/Menu';
import MovieIcon from '@mui/icons-material/Movie';
import PaletteIcon from '@mui/icons-material/Palette';

export interface NavItem {
  to: string;
  icon: React.ComponentType;
  labelKey: string;
}

export const navigationConfig: NavItem[] = [
  {
    to: '/',
    icon: MenuIcon,
    labelKey: 'navigation.home',
  },
  {
    to: '/movies',
    icon: MovieIcon,
    labelKey: 'navigation.movies',
  },
  {
    to: '/canvas',
    icon: PaletteIcon,
    labelKey: 'navigation.canvas',
  },
];
