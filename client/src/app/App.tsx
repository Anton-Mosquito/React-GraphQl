import { AppRouter } from './providers/router';
import MainLayout from '@/shared/layouts/MainLayout/MainLayout';

const App = () => {
  return (
    <MainLayout>
      <AppRouter />
    </MainLayout>
  );
};

export default App;
