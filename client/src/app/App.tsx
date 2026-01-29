import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getUserInited, initAuthData } from '@/entities/User';
import MainLayout from '@/shared/layouts/MainLayout/MainLayout';

import { AppRouter } from './providers/router';

const App = () => {
  const dispatch = useDispatch();
  const _inited = useSelector(getUserInited);

  useEffect(() => {
    if (!_inited) {
      dispatch(initAuthData());
    }
  }, [dispatch, _inited]);

  return (
    <MainLayout>
      <AppRouter />
    </MainLayout>
  );
};

export default App;
