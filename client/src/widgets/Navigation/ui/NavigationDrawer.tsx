import MenuIcon from '@mui/icons-material/Menu';
import MovieIcon from '@mui/icons-material/Movie';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const list = useCallback(() => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={onClose}
      onKeyDown={onClose}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/">
            <ListItemIcon>
              <MenuIcon />
            </ListItemIcon>
            <ListItemText primary={t('navigation.home')} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/movies">
            <ListItemIcon>
              <MovieIcon />
            </ListItemIcon>
            <ListItemText primary={t('navigation.movies')} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  ), [t, onClose]);

  return (
    <Drawer anchor="left" open={isOpen} onClose={onClose}>
      {list()}
    </Drawer>
  );
};