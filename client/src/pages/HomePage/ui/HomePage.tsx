import { Container, Typography, Box } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';

import { getUserAuthData } from '@/entities/User';
import { AuthTabs } from '@/features/AuthByUsername/ui/AuthTabs/AuthTabs';

const HomePage = () => {
  const authData = useSelector(getUserAuthData);

  if (!authData) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'calc(100vh - 64px)',
          }}
        >
          <AuthTabs onSuccess={() => {}} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to App, {authData.username}!
        </Typography>
        <Typography variant="body1">
          You are logged in. Here you can explore movies, manage your profile, and more.
        </Typography>
      </Box>
    </Container>
  );
};

export default HomePage;
