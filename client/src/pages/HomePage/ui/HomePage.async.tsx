import { type FC, lazy } from 'react';

export const HomePageAsync = lazy<FC>(async () => await import('./HomePage'));
