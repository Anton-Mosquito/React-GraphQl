import { ActivatePage } from '@/pages/ActivatePage';
import { CanvasPage } from '@/pages/CanvasPage';
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
  getRouteMovies,
  getRouteActivate,
  getRouteCanvas,
} from '@/shared/const/router';
import { type AppRouteProps } from '@/shared/types/router';

export const routeConfig: Record<AppRoutes, AppRouteProps> = {
  [AppRoutes.MAIN]: {
    path: getRouteMain(),
    element: <HomePage />,
  },
  [AppRoutes.MOVIES]: {
    path: getRouteMovies(),
    element: <MoviePage />,
    authOnly: true,
  },
  [AppRoutes.SETTINGS]: {
    path: getRouteSettings(),
    element: <SettingsPage />,
    authOnly: true,
  },
  [AppRoutes.RECOMMENDED]: {
    path: getRouteRecommended(),
    element: <RecommendPage />,
    authOnly: true,
  },
  [AppRoutes.FORBIDDEN]: {
    path: getRouteForbidden(),
    element: <ForbiddenPage />,
  },
  [AppRoutes.ACTIVATE]: {
    path: getRouteActivate(':link'),
    element: <ActivatePage />,
  },
  [AppRoutes.CANVAS]: {
    path: getRouteCanvas(),
    element: <CanvasPage />,
    authOnly: true,
  },
  [AppRoutes.NOT_FOUND]: {
    path: '*',
    element: <NotFoundPage />,
  },
};
