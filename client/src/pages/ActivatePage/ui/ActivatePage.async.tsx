import { type FC, lazy } from 'react';

export const ActivatePageAsync = lazy<FC>(async () => await import('./ActivatePage'));
