import { type ReactNode, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';

import { Navigation } from '@/widgets/Navigation';
import { useTheme } from '@/shared/lib/hooks/useTheme/useTheme';
import { Theme } from '@/shared/const/theme';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { theme } = useTheme();

  const mode = theme === Theme.DARK ? 'dark' : 'light';

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Navigation />
      <Box sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}>
        <Container maxWidth="xl">{children}</Container>
      </Box>
    </ThemeProvider>
  );
};

export default MainLayout;
