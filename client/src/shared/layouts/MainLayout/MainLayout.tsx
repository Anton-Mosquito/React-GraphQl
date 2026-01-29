import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { ukUA, enUS } from '@mui/material/locale';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { Theme } from '@/shared/const/theme';
import { useTheme } from '@/shared/lib/hooks/useTheme/useTheme';
import { Navigation } from '@/widgets/Navigation';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { theme } = useTheme();
  const { i18n } = useTranslation();

  const mode = theme === Theme.DARK ? 'dark' : 'light';

  const muiTheme = useMemo(() => {
    const currentLocale = i18n.language === 'uk-UA' ? ukUA : enUS;

    return createTheme(
      {
        palette: {
          mode,
        },
      },
      currentLocale,
    );
  }, [mode, i18n.language]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Navigation />
      <Box
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100],
          transition: 'background-color 0.3s ease',
        }}
      >
        <Container maxWidth="xl">{children}</Container>
      </Box>
    </ThemeProvider>
  );
};

export default MainLayout;
