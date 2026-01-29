import { type FC, lazy } from 'react';

export const MoviePageAsync = lazy<FC>(async () => await import('./MoviePage'));
