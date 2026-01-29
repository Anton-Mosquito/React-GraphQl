import type { Point } from '../../../features/canvas/model/types/websocket';
import { useCallback, useRef } from 'react';
import { type RefObject } from 'react';

interface UseTouchOptions {
  onTouchStart?: (point: Point) => void;
  onTouchMove?: (point: Point) => void;
  onTouchEnd?: () => void;
}

export const useCanvasTouch = (
  canvasRef: RefObject<HTMLCanvasElement>,
  options: UseTouchOptions,
) => {
  const isTouchingRef = useRef(false);

  const getTouchPoint = useCallback(
    (touch: Touch): Point | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    },
    [canvasRef],
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      isTouchingRef.current = true;

      const point = getTouchPoint(e.touches[0]);
      if (point) {
        options.onTouchStart?.(point);
      }
    },
    [getTouchPoint, options],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      if (!isTouchingRef.current) return;

      const point = getTouchPoint(e.touches[0]);
      if (point) {
        options.onTouchMove?.(point);
      }
    },
    [getTouchPoint, options],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      isTouchingRef.current = false;
      options.onTouchEnd?.();
    },
    [options],
  );

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};
