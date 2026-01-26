export const enum AppRoutes {
  MAIN = 'main',
  SETTINGS = 'settings',
  RECOMMENDED = 'recommend',
  FORBIDDEN = 'forbidden',
  NOT_FOUND = 'not_found',
}

export const getRouteMain = (): string => '/';
export const getRouteSettings = (): string => '/settings';
export const getRouteRecommended = (): string => '/recommend';
export const getRouteForbidden = (): string => '/forbidden';


export const AppRouterByPathPattern: Record<string, AppRoutes> = {
  [getRouteMain()]: AppRoutes.MAIN,
  [getRouteSettings()]: AppRoutes.SETTINGS,
  [getRouteRecommended()]: AppRoutes.RECOMMENDED,
};
