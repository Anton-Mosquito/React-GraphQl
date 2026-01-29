import WebSocket from 'ws';
import { WsMessage, LoadHistoryMessage, LoadImageMessage } from '#schema/index.js';

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
  LOAD_HISTORY = 'load_history',
}

export interface BroadcastEvent {
  type: WsEventType;
  timestamp: string;
  data: WsMessage | LoadHistoryMessage | LoadImageMessage | { message: string };
}
