import { type ReactNode } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';

import { Navigation } from '@/widgets/Navigation';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <CssBaseline />
      <Navigation />
      <Box sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}>
        <Container maxWidth="xl">{children}</Container>
      </Box>
    </>
  );
};

export default MainLayout;
