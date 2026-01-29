import { Box, CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { getUserInited, initAuthData } from '@/entities/User';
import MainLayout from '@/shared/layouts/MainLayout/MainLayout';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch';

import { AppRouter } from './providers/router';

const App = () => {
  const dispatch = useAppDispatch();
  const inited = useSelector(getUserInited);

  useEffect(() => {
    if (!inited) {
      dispatch(initAuthData());
    }
  }, [dispatch, inited]);

  if (!inited) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <MainLayout>
      <AppRouter />
    </MainLayout>
  );
};

export default App;
