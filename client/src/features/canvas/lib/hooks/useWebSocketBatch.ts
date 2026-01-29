import { useRef, useCallback, useEffect } from 'react';

import type { WebSocketMessage } from '../../model/types/canvas';

interface UseWebSocketBatchOptions {
  sendJson: (data: WebSocketMessage) => void;
  batchWindow?: number; // ms
}

interface UseWebSocketBatchReturn {
  queueMessage: (message: WebSocketMessage) => void;
  flushBatch: () => void;
}

/**
 * WebSocket Message Batching Hook
 * Batches multiple WebSocket messages within a time window to reduce network overhead
 *
 * @param sendJson - Function to send JSON data over WebSocket
 * @param batchWindow - Time window in ms to batch messages (default: 50ms)
 * @returns Object with queueMessage and flushBatch functions
 */
export const useWebSocketBatch = ({
  sendJson,
  batchWindow = 50,
}: UseWebSocketBatchOptions): UseWebSocketBatchReturn => {
  const batchRef = useRef<WebSocketMessage[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const flushBatch = useCallback(() => {
    if (batchRef.current.length === 0) return;

    if (batchRef.current.length === 1) {
      sendJson(batchRef.current[0]);
    } else {
      const batchMessage = {
        method: 'batch' as const,
        messages: batchRef.current,
      } as WebSocketMessage;
      sendJson(batchMessage);
    }

    batchRef.current = [];
  }, [sendJson]);

  const queueMessage = useCallback(
    (message: WebSocketMessage) => {
      batchRef.current.push(message);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(flushBatch, batchWindow);
    },
    [flushBatch, batchWindow],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        flushBatch();
      }
    };
  }, [flushBatch]);

  return { queueMessage, flushBatch };
};
