import { type FC, lazy } from 'react';

export const CanvasPageAsync = lazy<FC>(async () => await import('./CanvasPage'));
