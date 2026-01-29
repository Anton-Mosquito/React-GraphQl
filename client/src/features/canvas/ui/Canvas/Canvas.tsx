import { Paper } from '@mui/material';
import { useRef, useEffect, useState, forwardRef, useImperativeHandle, useCallback } from 'react';

import { useCanvasSocket } from '@/shared/lib/hooks/useCanvasSocket';

import type { CanvasProps, CanvasRef, DrawFigure } from '../../model/types/canvas';

export const Canvas = forwardRef<CanvasRef, CanvasProps>(
  ({ sessionId, username, strokeColor, lineWidth, onStackChange }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const prevX = useRef<number | null>(null);
    const prevY = useRef<number | null>(null);
    const [undoStack, setUndoStack] = useState<DrawFigure[]>([]);
    const [redoStack, setRedoStack] = useState<DrawFigure[]>([]);

    const { socketRef, sendJson } = useCanvasSocket(sessionId, username);

    const redrawCanvas = (actions: DrawFigure[]) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Redraw all actions
      actions.forEach((drawMsg) => {
        if (drawMsg.type === 'brush') {
          const points = drawMsg.points;
          if (points.length >= 2) {
            ctx.save();
            ctx.strokeStyle = drawMsg.color;
            ctx.lineWidth = drawMsg.stroke;
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            ctx.lineTo(points[1].x, points[1].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      });
    };

    const undo = useCallback(() => {
      if (undoStack.length > 0) {
        const lastAction = undoStack[undoStack.length - 1];
        setUndoStack(undoStack.slice(0, -1));
        setRedoStack([...redoStack, lastAction]);
        redrawCanvas(undoStack.slice(0, -1));
      }
    }, [undoStack, redoStack]);

    const redo = useCallback(() => {
      if (redoStack.length > 0) {
        const action = redoStack[redoStack.length - 1];
        setRedoStack(redoStack.slice(0, -1));
        setUndoStack([...undoStack, action]);
        redrawCanvas([...undoStack, action]);
      }
    }, [undoStack, redoStack]);

    useImperativeHandle(
      ref,
      () => ({
        undo,
        redo,
        canUndo: undoStack.length > 0,
        canRedo: redoStack.length > 0,
      }),
      [undoStack, redoStack, undo, redo],
    );

    useEffect(() => {
      onStackChange?.(undoStack.length > 0, redoStack.length > 0);
    }, [undoStack, redoStack, onStackChange]);

    useEffect(() => {
      const socket = socketRef.current;
      if (!socket) return;

      const handleMessage = (event: MessageEvent) => {
        try {
          const msg = JSON.parse(event.data);
          const { data } = msg;
          if (data.method === 'draw' && data.figure.type === 'brush') {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const points = data.figure.points;
            if (points.length >= 2) {
              ctx.save();
              ctx.strokeStyle = data.figure.color;
              ctx.lineWidth = data.figure.stroke;
              ctx.beginPath();
              ctx.moveTo(points[0].x, points[0].y);
              ctx.lineTo(points[1].x, points[1].y);
              ctx.stroke();
              ctx.restore();
            }
          } else if (data.method === 'load-history') {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            data.history.forEach((drawMsg: DrawFigure) => {
              if (drawMsg.type === 'brush') {
                const points = drawMsg.points;
                if (points.length >= 2) {
                  ctx.save();
                  ctx.strokeStyle = drawMsg.color;
                  ctx.lineWidth = drawMsg.stroke;
                  ctx.beginPath();
                  ctx.moveTo(points[0].x, points[0].y);
                  ctx.lineTo(points[1].x, points[1].y);
                  ctx.stroke();
                  ctx.restore();
                }
              }
            });
            // Set undo stack to loaded history
            setUndoStack(data.history);
            setRedoStack([]);
          } else if (data.method === 'load-image') {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const img = new Image();
            img.onload = () => {
              ctx.drawImage(img, 0, 0);
            };
            img.src = data.image;
            // Clear local stacks since image is loaded
            setUndoStack([]);
            setRedoStack([]);
          }
        } catch (error) {
          console.error('Error parsing socket message:', error);
        }
      };

      socket.addEventListener('message', handleMessage);
      return () => socket.removeEventListener('message', handleMessage);
    }, [socketRef]);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsMouseDown(true);
      prevX.current = x;
      prevY.current = y;
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isMouseDown || prevX.current === null || prevY.current === null) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.lineTo(x, y);
      ctx.stroke();

      sendJson({
        method: 'draw',
        figure: {
          type: 'brush',
          points: [
            { x: prevX.current, y: prevY.current },
            { x, y },
          ],
          color: strokeColor,
          stroke: lineWidth,
        },
      });

      // Add to undo stack
      const action = {
        method: 'draw',
        figure: {
          type: 'brush',
          points: [
            { x: prevX.current, y: prevY.current },
            { x, y },
          ],
          color: strokeColor,
          stroke: lineWidth,
        },
      };
      setUndoStack([...undoStack, action]);
      setRedoStack([]); // Clear redo on new action

      prevX.current = x;
      prevY.current = y;
    };

    const handleMouseUp = () => {
      setIsMouseDown(false);
      prevX.current = null;
      prevY.current = null;
    };

    return (
      <Paper
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
          padding: 2,
        }}
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{
            border: '1px solid #ccc',
            backgroundColor: 'white',
            cursor: 'crosshair',
          }}
        />
      </Paper>
    );
  },
);

Canvas.displayName = 'Canvas';
