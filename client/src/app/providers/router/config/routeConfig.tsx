import { ForbiddenPage } from '@/pages/ForbiddenPage';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { RecommendPage } from '@/pages/RecommendPage';
import { SettingsPage } from '@/pages/SettingsPage';

import {
  AppRoutes,
  getRouteMain,
  getRouteRecommended,
  getRouteSettings,
  getRouteForbidden,
} from '@/shared/const/router';
import { type AppRouteProps } from '@/shared/types/router';

export const routeConfig: Record<AppRoutes, AppRouteProps> = {
  [AppRoutes.MAIN]: {
    path: getRouteMain(),
    element: <HomePage />,
  },
  [AppRoutes.SETTINGS]: {
    path: getRouteSettings(),
    element: <SettingsPage />,
  },
  [AppRoutes.RECOMMENDED]: {
    path: getRouteRecommended(),
    element: <RecommendPage />,
  },
  [AppRoutes.FORBIDDEN]: {
    path: getRouteForbidden(),
    element: <ForbiddenPage />,
  },
  [AppRoutes.NOT_FOUND]: {
    path: '*',
    element: <NotFoundPage />,
  },
};
