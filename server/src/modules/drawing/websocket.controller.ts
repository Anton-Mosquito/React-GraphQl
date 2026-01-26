import WebSocket, { Server as WSServer, type RawData } from 'ws';
import { logger } from '#utils/index.js';
import {
  wsMessageSchema,
  WsMessage,
  ConnectionMessage,
  DrawMessage,
} from '#schema/index.js';
import {
  WsEventType,
  ExtendedWebSocket,
  BroadcastEvent,
} from '#types/index.js';

export default class WebSocketController {
  private wss: WSServer;
  private readonly MAX_MESSAGE_SIZE = 1024 * 100; // 100KB max message size
  private readonly CONNECTION_TIMEOUT = 60_000; // 60 seconds timeout for uninitialized connections

  constructor(wss: WSServer) {
    this.wss = wss;
    logger.info('WebSocket Controller initialized');
  }

  /**
   * Handle new WebSocket connection
   * Sets up event listeners for the connection lifecycle
   */
  handleConnection(ws: ExtendedWebSocket): void {
    ws.connectedAt = new Date();
    ws.isInitialized = false;

    logger.debug('New WebSocket connection established', {
      timestamp: ws.connectedAt.toISOString(),
    });

    const initTimeout = setTimeout(() => {
      if (!ws.isInitialized) {
        logger.warn(
          'WebSocket connection timeout - no initialization message received',
        );
        ws.close(1000, 'Connection timeout');
      }
    }, this.CONNECTION_TIMEOUT);

    ws.on('message', (rawMessage: RawData) => {
      try {
        if (!ws.isInitialized) {
          clearTimeout(initTimeout);
        }

        this.handleMessage(ws, rawMessage);
      } catch (error) {
        this.handleError(ws, error);
      }
    });

    ws.on('close', (code: number, reason: Buffer) => {
      clearTimeout(initTimeout);
      this.handleClose(ws, code, reason.toString());
    });

    ws.on('error', (error: Error) => {
      logger.error('WebSocket error', {
        username: ws.username,
        id: ws.id,
        error: error.message,
      });
    });

    ws.on('pong', () => {
      logger.debug('Pong received', { username: ws.username });
    });
  }

  /**
   * Handle incoming WebSocket message
   */
  private handleMessage(ws: ExtendedWebSocket, rawMessage: RawData): void {
    const messageText = this.rawDataToString(rawMessage);

    if (messageText.length > this.MAX_MESSAGE_SIZE) {
      logger.warn('Message too large', {
        size: messageText.length,
        maxSize: this.MAX_MESSAGE_SIZE,
        username: ws.username,
      });
      this.sendError(ws, 'Message too large');
      return;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(messageText);
    } catch (error) {
      logger.warn('Invalid JSON received', {
        username: ws.username,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      this.sendError(ws, 'Invalid JSON format');
      return;
    }

    const validationResult = wsMessageSchema.safeParse(parsed);

    if (!validationResult.success) {
      logger.warn('Message validation failed', {
        username: ws.username,
        errors: validationResult.error.issues,
        message: parsed,
      });
      this.sendError(ws, 'Invalid message format');
      return;
    }

    const message = validationResult.data as WsMessage;

    if (message.method === 'connection') {
      this.handleConnectionMessage(ws, message as ConnectionMessage);
    } else if (message.method === 'draw') {
      this.handleDrawMessage(ws, message as DrawMessage);
    }
  }

  /**
   * Handle connection message (user join/initialization)
   */
  private handleConnectionMessage(
    ws: ExtendedWebSocket,
    message: ConnectionMessage,
  ): void {
    ws.username = message.username;
    ws.id = message.id;
    ws.isInitialized = true;

    logger.info('User connected', {
      username: ws.username,
      id: ws.id,
      connectedAt: ws.connectedAt?.toISOString(),
    });

    const event: BroadcastEvent = {
      type: WsEventType.USER_CONNECTED,
      timestamp: new Date().toISOString(),
      data: {
        method: 'connection',
        username: ws.username,
        id: ws.id,
      },
    };

    this.broadcast(ws, event);
  }

  /**
   * Handle draw message (user draws something)
   */
  private handleDrawMessage(ws: ExtendedWebSocket, message: DrawMessage): void {
    if (!ws.isInitialized || !ws.username) {
      logger.warn('Draw message from uninitialized connection');
      this.sendError(ws, 'Connection not initialized');
      return;
    }

    logger.debug('Draw event received', {
      username: ws.username,
      figureType: message.figure.type,
    });

    const event: BroadcastEvent = {
      type: WsEventType.DRAW,
      timestamp: new Date().toISOString(),
      data: {
        ...message,
        username: ws.username, // Attach username to draw message
      },
    };

    this.broadcast(ws, event);
  }

  /**
   * Handle WebSocket close event
   */
  private handleClose(
    ws: ExtendedWebSocket,
    code: number,
    reason: string,
  ): void {
    logger.info('WebSocket connection closed', {
      username: ws.username,
      id: ws.id,
      code,
      reason: reason || 'No reason provided',
      duration: ws.connectedAt
        ? Date.now() - ws.connectedAt.getTime()
        : undefined,
    });

    // Notify other users if connection was initialized
    if (ws.isInitialized && ws.username) {
      const event: BroadcastEvent = {
        type: WsEventType.USER_DISCONNECTED,
        timestamp: new Date().toISOString(),
        data: {
          method: 'connection',
          username: ws.username,
          id: ws.id,
        },
      };

      this.broadcast(ws, event);
    }
  }

  /**
   * Handle errors during message processing
   */
  private handleError(ws: ExtendedWebSocket, error: unknown): void {
    logger.error('Error handling WebSocket message', {
      username: ws.username,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    this.sendError(ws, 'Internal server error');
  }

  /**
   * Send error message to client
   */
  private sendError(ws: ExtendedWebSocket, message: string): void {
    if (ws.readyState === WebSocket.OPEN) {
      const errorEvent: BroadcastEvent = {
        type: WsEventType.ERROR,
        timestamp: new Date().toISOString(),
        data: { message },
      };

      try {
        ws.send(JSON.stringify(errorEvent));
      } catch (error) {
        logger.error('Failed to send error message', {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  }

  /**
   * Broadcast message to all connected clients except sender
   */
  private broadcast(sender: ExtendedWebSocket, event: BroadcastEvent): void {
    const payload = JSON.stringify(event);
    let successCount = 0;
    let failCount = 0;

    this.wss.clients.forEach((client) => {
      if (client === sender || client.readyState !== WebSocket.OPEN) {
        return;
      }

      try {
        client.send(payload);
        successCount++;
      } catch (error) {
        failCount++;
        logger.error('Failed to broadcast to client', {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });

    logger.debug('Broadcast completed', {
      eventType: event.type,
      successCount,
      failCount,
      totalClients: this.wss.clients.size,
    });
  }

  /**
   * Convert raw WebSocket data to string
   */
  private rawDataToString(data: RawData): string {
    if (typeof data === 'string') {
      return data;
    }

    if (Buffer.isBuffer(data)) {
      return data.toString('utf8');
    }

    if (Array.isArray(data)) {
      return Buffer.concat(data).toString('utf8');
    }

    return Buffer.from(data).toString('utf8');
  }

  /**
   * Get connection statistics
   */
  getStats(): {
    totalConnections: number;
    initializedConnections: number;
    rooms: Map<string, number>;
  } {
    const rooms = new Map<string, number>();
    let initializedCount = 0;

    this.wss.clients.forEach((client) => {
      const extClient = client as ExtendedWebSocket;

      if (extClient.isInitialized) {
        initializedCount++;
      }

      if (extClient.id) {
        rooms.set(extClient.id, (rooms.get(extClient.id) || 0) + 1);
      }
    });

    return {
      totalConnections: this.wss.clients.size,
      initializedConnections: initializedCount,
      rooms,
    };
  }

  /**
   * Ping all clients to check connection health
   */
  pingAll(): void {
    logger.debug('Pinging all clients');

    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.ping();
        } catch (error) {
          logger.error('Failed to ping client', {
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    });
  }
}
