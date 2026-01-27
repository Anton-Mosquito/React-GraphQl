import MainLayout from '@/shared/layouts/MainLayout/MainLayout';

import { AppRouter } from './providers/router';

const App = () => {
  return (
    <MainLayout>
      <AppRouter />
    </MainLayout>
  );
};

export default App;
