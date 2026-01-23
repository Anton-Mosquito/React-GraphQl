import { Server as WSServer } from 'ws';
import WebSocket from 'ws';
import {
  ExtendedWebSocket,
  WsMessageSchema,
  ConnectionMessageSchema,
  DrawMessageSchema,
} from './websocket.types.js';

export default class WebSocketController {
  private wss: WSServer;

  constructor(wss: WSServer) {
    this.wss = wss;
  }

  handleConnection(ws: ExtendedWebSocket) {
    ws.on('message', (raw) => {
      try {
        const text = typeof raw === 'string' ? raw : raw.toString();
        const parsed = JSON.parse(text);

        // Validate message shape
        const msg = WsMessageSchema.parse(parsed);

        if (msg.method === 'connection') {
          const payload = ConnectionMessageSchema.parse(msg);
          ws.username = payload.username;
          if (payload.id) ws.id = payload.id;
          // Broadcast new connection to others
          this.broadcast(ws, {
            method: 'connection',
            username: ws.username,
            id: ws.id,
          });
          return;
        }

        if (msg.method === 'draw') {
          const payload = DrawMessageSchema.parse(msg);
          // Broadcast draw events to other clients
          this.broadcast(ws, payload);
          return;
        }
      } catch (error) {
        // ignore malformed messages or validation errors
      }
    });

    ws.on('close', () => {
      // Notify others that the user disconnected
      if (ws.username) {
        this.broadcast(ws, {
          method: 'connection',
          username: ws.username,
          id: ws.id,
        });
      }
    });
  }

  private broadcast(sender: ExtendedWebSocket, data: unknown) {
    const payload = JSON.stringify(data);
    this.wss.clients.forEach((client) => {
      // only send to open clients and skip sender
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        (client as WebSocket).send(payload);
      }
    });
  }
}
