export const enum AppRoutes {
  MAIN = 'main',
  SETTINGS = 'settings',
  RECOMMENDED = 'recommend',
  FORBIDDEN = 'forbidden',
  NOT_FOUND = 'not_found',
  MOVIE = 'movie',
  ACTIVATE = 'activate',
}

export const getRouteMain = (): string => '/';
export const getRouteSettings = (): string => '/settings';
export const getRouteRecommended = (): string => '/recommend';
export const getRouteMovie = (): string => '/movie';
export const getRouteForbidden = (): string => '/forbidden';
export const getRouteActivate = (link: string): string => `/activate/${link}`;

export const AppRouterByPathPattern: Record<string, AppRoutes> = {
  [getRouteMain()]: AppRoutes.MAIN,
  [getRouteSettings()]: AppRoutes.SETTINGS,
  [getRouteRecommended()]: AppRoutes.RECOMMENDED,
  [getRouteMovie()]: AppRoutes.MOVIE,
  [getRouteActivate(':link')]: AppRoutes.ACTIVATE,
};
