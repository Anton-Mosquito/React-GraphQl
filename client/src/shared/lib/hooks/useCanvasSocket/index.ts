import { useRef, useState, useEffect } from 'react';

interface ConnectionMessage {
  method: 'connection';
  id: string;
  username: string;
}

type WebSocketMessage = ConnectionMessage | { method: string; [key: string]: unknown };

interface UseCanvasSocketReturn {
  socketRef: React.RefObject<WebSocket | null>;
  isConnected: boolean;
  sendJson: (data: WebSocketMessage) => void;
}

export const useCanvasSocket = (sessionId: string, username: string): UseCanvasSocketReturn => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL;

  useEffect(() => {
    if (!sessionId || !username) {
      return;
    }

    const socket = new WebSocket(websocketUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      const connectionMessage: ConnectionMessage = {
        method: 'connection',
        id: sessionId,
        username,
      };
      socket.send(JSON.stringify(connectionMessage));
      setIsConnected(true);
    };

    socket.onclose = () => {
      setIsConnected(false);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
    };
  }, [sessionId, username, websocketUrl]);

  const sendJson = (data: WebSocketMessage) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    }
  };

  return { socketRef, isConnected, sendJson };
};
