import type { IncomingMessage } from 'http';
import type WebSocket from 'ws';

declare module 'express' {
  interface Application {
    ws?: (
      path: string,
      handler: (
        ws: WebSocket,
        req: IncomingMessage & Record<string, unknown>,
      ) => void,
    ) => void;
  }
}
