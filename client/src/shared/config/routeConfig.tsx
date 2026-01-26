import { HomePage } from 'pages/HomePage';
import { SettingsPage } from 'pages/SettingsPage';
import { RecommendPage } from 'pages/RecommendPage';
import { RouteProps } from 'react-router-dom';

export enum AppRoutes {
  MAIN = 'main',
  SETTINGS = 'settings',
  RECOMMENDED = 'recommend',
}

export const RoutePath: Record<AppRoutes, string> = {
  [AppRoutes.MAIN]: '/',
  [AppRoutes.SETTINGS]: '/settings',
  [AppRoutes.RECOMMENDED]: '/recommend',
};

export const routeConfig: Record<AppRoutes, RouteProps> = {
  [AppRoutes.MAIN]: {
    path: RoutePath.main,
    element: <HomePage />,
  },
  [AppRoutes.SETTINGS]: {
    path: RoutePath.settings,
    element: <SettingsPage />,
  },
  [AppRoutes.RECOMMENDED]: {
    path: RoutePath.recommend,
    element: <RecommendPage />,
  },
};
