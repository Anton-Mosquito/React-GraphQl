import { Paper } from '@mui/material';
import { useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { useCanvasTouch } from '@/shared/lib/hooks/useCanvasTouch';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch';

import { useCanvasSocket } from '../../lib/hooks/useCanvasSocket';
import { useWebSocketBatch } from '../../lib/hooks/useWebSocketBatch';
import { selectUndoStack } from '../../model/selectors/canvasSelectors';
import {
  selectStrokeColor,
  selectLineWidth,
  selectSelectedTool,
} from '../../model/selectors/toolsSelectors';
import { addToHistory, loadHistory } from '../../model/slices/canvasSlice';
import type {
  CanvasProps,
  DrawFigure,
  WebSocketMessage,
  DrawMessage,
  LoadHistoryMessage,
  LoadImageMessage,
} from '../../model/types/canvas';
import { CanvasDrawingService } from '../../model/utils/canvasDrawing';
import { clampPoint } from '../../model/utils/canvasHelpers';
import { CanvasOptimizer } from '../../model/utils/canvasOptimization';

export const Canvas = ({ sessionId, username, width = 800, height = 600 }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingServiceRef = useRef<CanvasDrawingService | null>(null);
  const optimizerRef = useRef<CanvasOptimizer>(new CanvasOptimizer());
  const isDrawingRef = useRef(false);
  const prevPointRef = useRef<{ x: number; y: number } | null>(null);

  const dispatch = useAppDispatch();
  const undoStack = useSelector(selectUndoStack);
  const strokeColor = useSelector(selectStrokeColor);
  const lineWidth = useSelector(selectLineWidth);
  const selectedTool = useSelector(selectSelectedTool);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawingServiceRef.current = new CanvasDrawingService(canvas);
  }, []);

  useEffect(() => {
    if (!drawingServiceRef.current || !canvasRef.current) return;
    if (!optimizerRef.current.shouldRedraw()) return;

    drawingServiceRef.current.redrawAll(
      undoStack,
      canvasRef.current.width,
      canvasRef.current.height,
    );
  }, [undoStack]);

  const handleWebSocketMessage = useCallback(
    (message: WebSocketMessage) => {
      const drawMsg = message as DrawMessage;
      const loadHistoryMsg = message as LoadHistoryMessage;
      const loadImageMsg = message as LoadImageMessage;

      if (drawMsg.method === 'draw' && drawMsg.figure) {
        if (drawingServiceRef.current) {
          drawingServiceRef.current.drawFigure(drawMsg.figure);
          dispatch(addToHistory(drawMsg.figure));
        }
        return;
      }

      if (loadHistoryMsg.method === 'load-history' && loadHistoryMsg.history) {
        dispatch(loadHistory(loadHistoryMsg.history));
        return;
      }

      if (loadImageMsg.method === 'load-image' && loadImageMsg.image && drawingServiceRef.current) {
        drawingServiceRef.current.drawImage(loadImageMsg.image).catch((error) => {
          console.error('Error loading image:', error);
        });
      }
    },
    [dispatch],
  );

  const { sendJson } = useCanvasSocket({
    sessionId,
    username,
    onMessage: handleWebSocketMessage,
    onConnect: () => {
      // Connection established
    },
    onDisconnect: () => {
      // Connection lost
    },
  });

  const { queueMessage } = useWebSocketBatch({ sendJson });

  const startDrawing = useCallback(
    (point: { x: number; y: number }) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const clampedPoint = clampPoint(point, canvas.width, canvas.height);
      const x = clampedPoint.x;
      const y = clampedPoint.y;

      isDrawingRef.current = true;
      prevPointRef.current = { x, y };

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (selectedTool === 'spray') return;

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(x, y);
    },
    [strokeColor, lineWidth, selectedTool],
  );

  const continueDrawing = useCallback(
    (point: { x: number; y: number }) => {
      if (!isDrawingRef.current || !prevPointRef.current) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const clampedPoint = clampPoint(point, canvas.width, canvas.height);
      const x = clampedPoint.x;
      const y = clampedPoint.y;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (selectedTool !== 'spray') {
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      let figure: DrawFigure;

      switch (selectedTool) {
        case 'spray':
          figure = {
            type: 'spray',
            point: { x, y },
            color: strokeColor,
            size: lineWidth * 2,
            density: 50,
          };
          break;
        case 'glow':
          figure = {
            type: 'glow',
            points: [prevPointRef.current, { x, y }],
            color: strokeColor,
            lineWidth,
          };
          break;
        case 'dashed':
          figure = {
            type: 'dashed',
            points: [prevPointRef.current, { x, y }],
            color: strokeColor,
            lineWidth,
          };
          break;
        case 'textured':
          figure = {
            type: 'textured',
            points: [prevPointRef.current, { x, y }],
            color: strokeColor,
            lineWidth,
            texture: 'rough', // Default texture
          };
          break;
        case 'gradient':
          figure = {
            type: 'gradient',
            points: [prevPointRef.current, { x, y }],
            startColor: strokeColor,
            endColor: strokeColor, // For now, same color
            lineWidth,
          };
          break;
        case 'brush':
        default:
          figure = {
            type: 'brush',
            points: [prevPointRef.current, { x, y }],
            color: strokeColor,
            stroke: lineWidth,
          };
          break;
      }

      // Draw locally for immediate feedback
      drawingServiceRef.current?.drawFigure(figure);

      queueMessage({
        method: 'draw',
        figure,
        sessionId,
        username,
      } as DrawMessage);

      dispatch(addToHistory(figure));

      prevPointRef.current = { x, y };
    },
    [strokeColor, lineWidth, sessionId, username, queueMessage, dispatch, selectedTool],
  );

  const endDrawing = useCallback(() => {
    isDrawingRef.current = false;
    prevPointRef.current = null;
  }, []);

  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useCanvasTouch(canvasRef, {
    onTouchStart: startDrawing,
    onTouchMove: continueDrawing,
    onTouchEnd: endDrawing,
  });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      startDrawing({ x, y });
    },
    [startDrawing],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      continueDrawing({ x, y });
    },
    [continueDrawing],
  );

  const handleMouseUp = useCallback(() => {
    endDrawing();
  }, [endDrawing]);

  const handleMouseLeave = useCallback(() => {
    endDrawing();
  }, [endDrawing]);

  return (
    <Paper
      elevation={3}
      sx={{
        display: 'inline-block',
        padding: 2,
        backgroundColor: '#f5f5f5',
      }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          cursor: 'crosshair',
          touchAction: 'none',
          backgroundColor: 'white',
          border: '1px solid #ccc',
        }}
      />
    </Paper>
  );
};

Canvas.displayName = 'Canvas';
