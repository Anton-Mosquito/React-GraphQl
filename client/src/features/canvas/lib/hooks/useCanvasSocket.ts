import { useRef, useEffect, useCallback, useState } from 'react';

import type { WebSocketMessage } from '../../model/types/canvas';

interface UseCanvasSocketOptions {
  sessionId: string;
  username: string;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
}

interface UseCanvasSocketReturn {
  socketRef: React.RefObject<WebSocket | null>;
  sendJson: (data: WebSocketMessage) => void;
  disconnect: () => void;
  isConnected: boolean;
}

export const useCanvasSocket = ({
  sessionId,
  username,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
  maxReconnectAttempts = 5,
  reconnectDelay = 3000,
}: UseCanvasSocketOptions): UseCanvasSocketReturn => {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageQueueRef = useRef<WebSocketMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const connectFnRef = useRef<(() => void) | null>(null);

  const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL;

  const onMessageRef = useRef(onMessage);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onMessageRef.current = onMessage;
    onConnectRef.current = onConnect;
    onDisconnectRef.current = onDisconnect;
    onErrorRef.current = onError;
  }, [onMessage, onConnect, onDisconnect, onError]);

  useEffect(() => {
    if (!sessionId || !username) {
      console.warn('Cannot connect: sessionId or username missing');
      return;
    }

    const connect = () => {
      try {
        const socket = new WebSocket(websocketUrl);
        socketRef.current = socket;

        socket.onopen = () => {
          setIsConnected(true);
          reconnectAttemptsRef.current = 0;

          const connectionMessage = {
            method: 'connection',
            id: sessionId,
            username,
          };
          socket.send(JSON.stringify(connectionMessage));

          while (messageQueueRef.current.length > 0) {
            const message = messageQueueRef.current.shift();
            if (message) {
              socket.send(JSON.stringify(message));
            }
          }

          onConnectRef.current?.();
        };

        socket.onmessage = (event: MessageEvent) => {
          try {
            const message = JSON.parse(event.data) as WebSocketMessage;
            onMessageRef.current?.(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        socket.onclose = () => {
          setIsConnected(false);
          onDisconnectRef.current?.();

          if (reconnectAttemptsRef.current < maxReconnectAttempts) {
            reconnectAttemptsRef.current++;
            const delay = reconnectDelay * 1.5 ** (reconnectAttemptsRef.current - 1);

            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, delay);

            return;
          }
          console.error('Max reconnection attempts reached');
        };

        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          onErrorRef.current?.(error);
        };
      } catch (error) {
        console.error('Error creating WebSocket:', error);
      }
    };

    connectFnRef.current = connect;
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [sessionId, username, websocketUrl, maxReconnectAttempts, reconnectDelay]);

  const sendJson = useCallback((data: WebSocketMessage) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected, queuing message');
      messageQueueRef.current.push(data);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setIsConnected(false);
  }, []);

  return {
    socketRef,
    sendJson,
    disconnect,
    isConnected,
  };
};
