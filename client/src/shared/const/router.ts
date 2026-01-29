export const enum AppRoutes {
  MAIN = 'main',
  SETTINGS = 'settings',
  RECOMMENDED = 'recommend',
  FORBIDDEN = 'forbidden',
  NOT_FOUND = 'not_found',
  MOVIES = 'movies',
  ACTIVATE = 'activate',
  CANVAS = 'canvas',
}

export const getRouteMain = (): string => '/';
export const getRouteSettings = (): string => '/settings';
export const getRouteRecommended = (): string => '/recommend';
export const getRouteMovies = (): string => '/movies';
export const getRouteForbidden = (): string => '/forbidden';
export const getRouteActivate = (link: string): string => `/activate/${link}`;
export const getRouteCanvas = (): string => '/canvas';

export const AppRouterByPathPattern: Record<string, AppRoutes> = {
  [getRouteMain()]: AppRoutes.MAIN,
  [getRouteSettings()]: AppRoutes.SETTINGS,
  [getRouteRecommended()]: AppRoutes.RECOMMENDED,
  [getRouteMovies()]: AppRoutes.MOVIES,
  [getRouteActivate(':link')]: AppRoutes.ACTIVATE,
  [getRouteCanvas()]: AppRoutes.CANVAS,
};
