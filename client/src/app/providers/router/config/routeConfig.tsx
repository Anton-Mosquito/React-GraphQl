import { ActivatePage } from '@/pages/ActivatePage';
import { ForbiddenPage } from '@/pages/ForbiddenPage';
import { HomePage } from '@/pages/HomePage';
import { MoviePage } from '@/pages/MoviePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { RecommendPage } from '@/pages/RecommendPage';
import { SettingsPage } from '@/pages/SettingsPage';
import {
  AppRoutes,
  getRouteMain,
  getRouteRecommended,
  getRouteSettings,
  getRouteForbidden,
  getRouteMovie,
  getRouteActivate,
} from '@/shared/const/router';
import { type AppRouteProps } from '@/shared/types/router';

export const routeConfig: Record<AppRoutes, AppRouteProps> = {
  [AppRoutes.MAIN]: {
    path: getRouteMain(),
    element: <HomePage />,
  },
  [AppRoutes.MOVIE]: {
    path: getRouteMovie(),
    element: <MoviePage />,
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
  [AppRoutes.ACTIVATE]: {
    path: getRouteActivate(),
    element: <ActivatePage />,
  },
  [AppRoutes.NOT_FOUND]: {
    path: '*',
    element: <NotFoundPage />,
  },
};
