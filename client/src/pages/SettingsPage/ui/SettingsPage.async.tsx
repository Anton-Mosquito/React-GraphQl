import { type FC, lazy } from 'react';

export const SettingsPageAsync = lazy<FC>(async () => await import('./SettingsPage'));
