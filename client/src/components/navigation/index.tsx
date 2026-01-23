import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useState, useContext, useCallback } from 'react';
import type { MouseEvent, KeyboardEvent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link as RouterLink } from 'react-router-dom';

import { LOCALES } from '../../const';
import { AppContext } from '../../providers/appContext';
import translate from '../../utils/translate';

const Navigation: React.FC = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { state, dispatch } = useContext(AppContext) as any;

  const setLanguage = useCallback(
    (locale: string) => {
      dispatch({
        type: 'setLocale',
        locale,
      });
    },
    [dispatch],
  );

  const toggleDrawer = (open: boolean) => (event: MouseEvent | KeyboardEvent) => {
    if (
      (event as KeyboardEvent).type === 'keydown' &&
      ((event as KeyboardEvent).key === 'Tab' || (event as KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setDrawerOpen(open);
  };

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="settings">
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={translate('navigation.settings')} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
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
          <Link component={RouterLink} to="/" sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div" sx={{ color: 'white' }}>
              <FormattedMessage id="navigation.home" />
            </Typography>
          </Link>
          <Box>
            <Button
              disabled={state.locale === LOCALES.ENGLISH}
              sx={{ my: 2, color: 'white' }}
              onClick={() => setLanguage(LOCALES.ENGLISH)}
            >
              ENGLISH
            </Button>

            <Button
              disabled={state.locale === LOCALES.UKRANIAN}
              sx={{ my: 2, color: 'white' }}
              onClick={() => setLanguage(LOCALES.UKRANIAN)}
            >
              Українська
            </Button>
          </Box>
          <Box sx={{ display: { xs: 'none', lg: 'flex' } }}>
            <Button
              component={RouterLink}
              to="settings"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              <FormattedMessage id="navigation.settings" />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </Box>
  );
};

export default Navigation;
