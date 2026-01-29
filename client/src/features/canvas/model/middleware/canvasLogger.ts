import type { Middleware } from '@reduxjs/toolkit';
import { type AnyAction } from '@reduxjs/toolkit';

/**
 * Canvas Logger Middleware
 * Logs all canvas and tools related actions in development mode
 */
export const canvasLogger: Middleware = () => (next) => (action: AnyAction) => {
  if (
    import.meta.env.DEV &&
    action.type &&
    (action.type.startsWith('canvas/') || action.type.startsWith('tools/'))
  ) {
    // eslint-disable-next-line no-console
    console.log(
      `%c[Canvas Action] ${action.type}`,
      'color: #9c27b0; font-weight: bold;',
      action.payload,
    );
  }
  return next(action);
};
