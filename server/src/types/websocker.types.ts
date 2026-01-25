import WebSocket from 'ws';
import { WsMessage } from '#schema/index.js';

export interface ExtendedWebSocket extends WebSocket {
  id?: string;
  username?: string;
  connectedAt?: Date;
  isInitialized?: boolean;
}

export const enum WsEventType {
  USER_CONNECTED = 'user_connected',
  USER_DISCONNECTED = 'user_disconnected',
  DRAW = 'draw',
  ERROR = 'error',
}

export interface BroadcastEvent {
  type: WsEventType;
  timestamp: string;
  data: WsMessage | { message: string };
}
