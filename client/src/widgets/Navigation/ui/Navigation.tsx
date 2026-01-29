import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import type { MouseEvent, KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import { getUserAuthData } from '@/entities/User';
import { logout } from '@/entities/User';
import { useAppDispatch } from '@/shared/lib/hooks';
import { LangSwitcher } from '@/shared/ui/LangSwitcher/ui/LangSwitcher';
import { ThemeSwitcher } from '@/shared/ui/ThemeSwitcher/ui/ThemeSwitcher';

import { NavigationDrawer } from './NavigationDrawer';

export const Navigation = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const authData = useSelector(getUserAuthData);

  const toggleDrawer = (open: boolean) => (event: MouseEvent | KeyboardEvent) => {
    if (
      (event as KeyboardEvent).type === 'keydown' &&
      ((event as KeyboardEvent).key === 'Tab' || (event as KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setDrawerOpen(open);
  };

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {authData?.isActivated && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2, display: { lg: 'block', xs: 'block' } }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Link component={RouterLink} to="/" sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div" sx={{ color: 'white' }}>
              {t('navigation.home')}
            </Typography>
          </Link>
          <LangSwitcher />
          <ThemeSwitcher />
          {authData && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem component={RouterLink} to="/settings" onClick={handleClose}>
                  {t('navigation.settings')}
                </MenuItem>
                <MenuItem onClick={handleLogout}>{t('logout')}</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      {authData?.isActivated && (
        <NavigationDrawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} />
      )}
    </Box>
  );
};
