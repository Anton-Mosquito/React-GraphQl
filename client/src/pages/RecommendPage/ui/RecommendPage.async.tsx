import { type FC, lazy } from 'react';

export const RecommendPageAsync = lazy<FC>(async () => await import('./RecommendPage'));
