import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState, useContext, useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";
import { AppContext } from "../../context/appContext";
import { LOCALES } from "../../const";

const Navigation = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { state, dispatch } = useContext(AppContext);

  const setLanguage = useCallback(
    (locale) => {
      dispatch({
        type: "setLocale",
        locale,
      });
    },
    [dispatch]
  );

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
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
            <ListItemText primary="Settings" />
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
            sx={{ mr: 2, display: { lg: "block", xs: "block" } }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Link component={RouterLink} to="/" sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div" sx={{ color: "white" }}>
              Movie recommendation
            </Typography>
          </Link>
          <Box>
            {state.locale}
            <Button
              disabled={state.locale === LOCALES.ENGLISH}
              sx={{ my: 2, color: "white" }}
              onClick={() => setLanguage(LOCALES.ENGLISH)}
            >
              ENGLISH
            </Button>

            <Button
              disabled={state.locale === LOCALES.UKRANIAN}
              sx={{ my: 2, color: "white" }}
              onClick={() => setLanguage(LOCALES.UKRANIAN)}
            >
              Українська
            </Button>
          </Box>
          <Box sx={{ display: { xs: "none", lg: "flex" } }}>
            <Button
              component={RouterLink}
              to="settings"
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Settings
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
