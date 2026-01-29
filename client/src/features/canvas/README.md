# Canvas Feature

Функціонал для спільного малювання на канвасі в реальному часі з використанням WebSocket.

## Структура папки

```
canvas/
├── index.ts                    # Головний експортний файл функції
├── model/                      # Бізнес-логіка та типи
│   ├── index.ts               # Експорт типів з папки model
│   └── types/
│       └── canvas.ts          # TypeScript типи для canvas
├── ui/                        # UI компоненти
│   ├── index.ts              # Експорт компонентів з папки ui
│   ├── Canvas/               # Компонент Canvas
│   │   ├── index.ts         # Експорт Canvas компонента
│   │   └── Canvas.tsx       # Основний компонент канвасу
│   └── Toolbar/             # Панель інструментів
│       ├── index.ts         # Експорт Toolbar компонента
│       └── Toolbar.tsx      # Компонент панелі інструментів
└── README.md                # Цей файл з описом
```

## Опис файлів

### index.ts
```typescript
export { Canvas } from './ui/Canvas';
export { Toolbar } from './ui/Toolbar';
export type { CanvasProps } from './model/types/canvas';
```

### model/index.ts
```typescript
export type { CanvasProps, ToolbarProps, DrawFigure, DrawMessage } from './types/canvas';
```

### model/types/canvas.ts
```typescript
export interface CanvasRef {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export interface CanvasProps {
  sessionId: string;
  username: string;
  strokeColor: string;
  lineWidth: number;
  onStackChange?: (canUndo: boolean, canRedo: boolean) => void;
}

export interface DrawFigure {
  type: 'brush';
  points: { x: number; y: number }[];
  color: string;
  stroke: number;
}
```

### ui/index.ts
```typescript
export { Canvas } from './Canvas';
export { Toolbar } from './Toolbar';
```

### ui/Canvas/index.ts
```typescript
export { Canvas } from './Canvas';
```

### ui/Canvas/Canvas.tsx
```tsx
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
```

### ui/Toolbar/index.ts
```typescript
export { Toolbar } from './Toolbar';
```

### ui/Toolbar/Toolbar.tsx
```tsx
import { Palette, Brush, Undo, Redo } from '@mui/icons-material';
import { Paper, IconButton, Slider, Button, Box, Typography } from '@mui/material';
import { type FC } from 'react';

import type { ToolbarProps } from '../../model/types/canvas';

export const Toolbar: FC<ToolbarProps> = ({
  selectedColor,
  setColor,
  lineWidth,
  setLineWidth,
  setTool,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => {
  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
    setTool('brush');
  };

  const handleEraser = () => {
    setColor('#FFFFFF');
    setTool('eraser');
  };

  return (
    <Paper
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        padding: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        backgroundColor: 'white',
        borderBottom: '1px solid #ccc',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Palette />
        <input
          type="color"
          value={selectedColor}
          onChange={handleColorChange}
          style={{
            width: 40,
            height: 40,
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 200 }}>
        <Brush />
        <Typography variant="body2">Width:</Typography>
        <Slider
          value={lineWidth}
          onChange={(_, value) => setLineWidth(value as number)}
          min={1}
          max={50}
          step={1}
          sx={{ flexGrow: 1 }}
        />
        <Typography variant="body2">{lineWidth}px</Typography>
      </Box>

      <Button
        variant="outlined"
        startIcon={<Brush />}
        onClick={handleEraser}
        sx={{ minWidth: 100 }}
      >
        Eraser
      </Button>

      {/* Undo/Redo */}
      <IconButton onClick={onUndo} disabled={!canUndo}>
        <Undo />
      </IconButton>
      <IconButton onClick={onRedo} disabled={!canRedo}>
        <Redo />
      </IconButton>
    </Paper>
  );
};
```

## Використання

```tsx
import { Canvas, Toolbar } from '@/features/canvas';

// В компоненті
<Canvas
  sessionId="session-123"
  username="user1"
  strokeColor="#000000"
  lineWidth={2}
  onStackChange={(canUndo, canRedo) => {
    // Обробка зміни стану undo/redo
  }}
/>

<Toolbar
  selectedColor="#000000"
  setColor={setColor}
  lineWidth={2}
  setLineWidth={setLineWidth}
  setTool={setTool}
  onUndo={handleUndo}
  onRedo={handleRedo}
  canUndo={canUndo}
  canRedo={canRedo}
/>
```

## CanvasPage - сторінка використання

### pages/CanvasPage/ui/CanvasPage.tsx
Сторінка, що використовує canvas функціонал для створення повноцінного інтерфейсу малювання.

#### Повний код:
```tsx
import { Box } from '@mui/material';
import { useMemo, useRef } from 'react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { getUserAuthData } from '@/entities/User';
import { Canvas, Toolbar } from '@/features/canvas';
import type { CanvasRef } from '@/features/canvas/model/types/canvas';

interface ToolState {
  tool: 'brush' | 'eraser';
  strokeColor: string;
  lineWidth: number;
}

const CanvasPage = () => {
  const user = useSelector(getUserAuthData);
  const username = user?.email || 'Anonymous';
  const sessionId = useMemo(() => crypto.randomUUID(), []); // Generate unique session ID
  const canvasRef = useRef<CanvasRef>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const [toolState, setToolState] = useState<ToolState>({
    tool: 'brush',
    strokeColor: '#000000',
    lineWidth: 5,
  });

  const setColor = (color: string) => {
    setToolState((prev) => ({ ...prev, strokeColor: color }));
  };

  const setLineWidth = (width: number) => {
    setToolState((prev) => ({ ...prev, lineWidth: width }));
  };

  const setTool = (tool: 'brush' | 'eraser') => {
    setToolState((prev) => ({ ...prev, tool }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Toolbar
        selectedColor={toolState.strokeColor}
        setColor={setColor}
        lineWidth={toolState.lineWidth}
        setLineWidth={setLineWidth}
        setTool={setTool}
        onUndo={() => {
          canvasRef.current?.undo();
        }}
        onRedo={() => {
          canvasRef.current?.redo();
        }}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <Box sx={{ flexGrow: 1 }}>
        <Canvas
          ref={canvasRef}
          sessionId={sessionId}
          username={username}
          strokeColor={toolState.strokeColor}
          lineWidth={toolState.lineWidth}
          onStackChange={(canUndoVal, canRedoVal) => {
            setCanUndo(canUndoVal);
            setCanRedo(canRedoVal);
          }}
        />
      </Box>
    </Box>
  );
};

export default CanvasPage;
```

#### Основні функції CanvasPage:
- **Отримання даних користувача** з Redux store (`getUserAuthData`)
- **Генерація унікального sessionId** за допомогою `crypto.randomUUID()`
- **Стан інструментів** (`ToolState`): колір, товщина лінії, тип інструменту
- **Керування станом Undo/Redo** через callback `onStackChange`
- **Інтеграція Toolbar та Canvas** компонентів
- **Responsive layout** з Material-UI Box компонентами

#### State management:
- `toolState` - стан поточних налаштувань малювання
- `canUndo/canRedo` - стан кнопок undo/redo
- `canvasRef` - реф до Canvas компонента для imperative API

#### Інтеграція з Redux:
Використовує `useSelector` для отримання даних авторизованого користувача з Redux store.

## Архітектура

Функція canvas використовує:
- **React** для UI компонентів
- **Material-UI** для стилізації
- **WebSocket** для реального часу синхронізації
- **TypeScript** для типізації
- **Feature-Sliced Design** архітектуру (розділення на model/ui)

## useCanvasSocket хук

### shared/lib/hooks/useCanvasSocket/index.ts
Кастомний React хук для керування WebSocket з'єднанням для canvas синхронізації.

#### Повний код:
```typescript
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
      socket.send(JSON.stringify(data));
    }
  };

  return { socketRef, isConnected, sendJson };
};
```

#### Основні функції useCanvasSocket:

##### 🔌 **Підключення до WebSocket:**
- Використовує `VITE_WEBSOCKET_URL` з environment variables
- Створює нове WebSocket з'єднання при зміні `sessionId` або `username`
- Надсилає повідомлення про підключення з `method: 'connection'`

##### 📨 **Відправка повідомлень:**
- `sendJson(data)` - відправляє JSON повідомлення через WebSocket
- Перевіряє стан з'єднання перед відправкою (`WebSocket.OPEN`)
- Приймає будь-які повідомлення з `method` полем

##### 🔄 **Управління станом:**
- `socketRef` - React ref до WebSocket інстансу
- `isConnected` - булевий стан підключення
- Автоматичне закриття з'єднання при unmount

##### 📋 **Типи повідомлень:**
- `ConnectionMessage` - повідомлення про підключення з id та username
- `WebSocketMessage` - union тип для всіх повідомлень з method полем

##### 🎯 **Використання в Canvas:**
```typescript
const { socketRef, isConnected, sendJson } = useCanvasSocket(sessionId, username);

// Відправка малюнка
sendJson({
  method: 'draw',
  figure: { type: 'brush', points: [...], color: '#000', stroke: 5 }
});
```

#### Обробка подій:
- `onopen` - відправляє connection message та встановлює `isConnected: true`
- `onclose` - встановлює `isConnected: false`
- `onerror` - логування помилок в консоль



# Dependency
```json
 "dependencies": {
    "@apollo/client": "^4.1.2",
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@fontsource/roboto": "^5.2.9",
    "@mui/icons-material": "^7.3.7",
    "@mui/material": "^7.3.7",
    "@mui/system": "^7.3.7",
    "@reduxjs/toolkit": "^2.11.2",
    "axios": "^1.13.3",
    "graphql": "^16.12.0",
    "i18next": "^25.8.0",
    "i18next-browser-languagedetector": "^8.0.2",
    "i18next-http-backend": "^3.0.2",
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "react-hook-form": "^7.71.1",
    "react-i18next": "^16.5.3",
    "react-redux": "^9.2.0",
    "react-router": "^7.12.0",
    "react-router-dom": "^7.12.0",
    "web-vitals": "^5.1.0"
  },
  "devDependencies": {
    "@eslint/css": "^0.14.1",
    "@eslint/js": "^9.39.2",
    "@eslint/json": "^0.14.0",
    "@graphql-codegen/cli": "^6.1.1",
    "@graphql-codegen/client-preset": "^5.2.2",
    "@types/eslint-plugin-jsx-a11y": "^6.10.1",
    "@types/jest": "^30.0.0",
    "@types/node": "^25.0.10",
    "@types/react": "^19.2.9",
    "@types/react-dom": "^19.2.3",
    "@typescript-eslint/eslint-plugin": "^8.53.1",
    "@typescript-eslint/parser": "^8.53.1",
    "@vitejs/plugin-react": "^5.1.2",
    "eslint": "^9.39.2",
    "eslint-config-prettier": "^10.1.8",
    "eslint-import-resolver-typescript": "^4.4.4",
    "eslint-plugin-import": "^2.32.0",
    "eslint-plugin-jsx-a11y": "^6.10.2",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-unused-imports": "^4.3.0",
    "globals": "^17.1.0",
    "husky": "^9.1.7",
    "lint-staged": "^16.2.7",
    "prettier": "^3.8.1",
    "typescript": "^5.9.3",
    "typescript-eslint": "^8.53.1",
    "vite": "^7.3.1"
  }
```