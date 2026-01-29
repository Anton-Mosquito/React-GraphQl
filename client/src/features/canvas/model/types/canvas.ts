export interface CanvasProps {
  sessionId: string;
  username: string;
  width?: number;
  height?: number;
}

export const enum WebSocketMethod {
  CONNECTION = 'connection',
  DRAW = 'draw',
  LOAD_HISTORY = 'load-history',
  LOAD_IMAGE = 'load-image',
  UNDO = 'undo',
  REDO = 'redo',
  BATCH = 'batch',
}

export interface Point {
  x: number;
  y: number;
}

export type ToolType = 'brush' | 'eraser' | 'line' | 'rectangle' | 'circle' | 'spray' | 'glow' | 'dashed' | 'textured' | 'gradient';

export interface BrushFigure {
  type: 'brush';
  points: Point[];
  color: string;
  stroke: number;
}

export interface EraserFigure {
  type: 'eraser';
  points: Point[];
  stroke: number;
}

export interface RectFigure {
  type: 'rect';
  points: Point[];
  color?: string;
  stroke?: number;
  width: number;
  height: number;
}

export interface CircleFigure {
  type: 'circle';
  points: Point[];
  color?: string;
  stroke?: number;
  radius: number;
}

export interface SprayFigure {
  type: 'spray';
  point: Point;
  color: string;
  size: number;
  density?: number;
}

export interface GlowFigure {
  type: 'glow';
  points: Point[];
  color: string;
  lineWidth: number;
}

export interface DashedFigure {
  type: 'dashed';
  points: Point[];
  color: string;
  lineWidth: number;
}

export interface TexturedFigure {
  type: 'textured';
  points: Point[];
  color: string;
  lineWidth: number;
  texture: 'rough' | 'chalk' | 'marker';
}

export interface GradientFigure {
  type: 'gradient';
  points: Point[];
  startColor: string;
  endColor: string;
  lineWidth: number;
}

export type DrawFigure = BrushFigure | EraserFigure | RectFigure | CircleFigure | SprayFigure | GlowFigure | DashedFigure | TexturedFigure | GradientFigure;

export interface ConnectionMessage {
  method: WebSocketMethod.CONNECTION;
  id: string;
  username: string;
}

export interface DrawMessage {
  method: WebSocketMethod.DRAW;
  figure: DrawFigure;
  sessionId?: string;
  username?: string;
}

export interface LoadHistoryMessage {
  method: WebSocketMethod.LOAD_HISTORY;
  history: DrawFigure[];
}

export interface LoadImageMessage {
  method: WebSocketMethod.LOAD_IMAGE;
  image: string;
}

export interface UndoMessage {
  method: WebSocketMethod.UNDO;
  sessionId: string;
}

export interface RedoMessage {
  method: WebSocketMethod.REDO;
  sessionId: string;
}

export interface BatchMessage {
  method: WebSocketMethod.BATCH;
  messages: WebSocketMessage[];
}

export type WebSocketMessage =
  | ConnectionMessage
  | DrawMessage
  | LoadHistoryMessage
  | LoadImageMessage
  | UndoMessage
  | RedoMessage
  | BatchMessage;

export interface WebSocketState {
  isConnected: boolean;
  error: string | null;
  reconnectAttempts: number;
}

export interface CanvasSchema {
  undoStack: DrawFigure[];
  redoStack: DrawFigure[];
  sessionId: string | null;
  isLoading: boolean;
}

export interface ToolsSchema {
  selectedTool: ToolType;
  strokeColor: string;
  lineWidth: number;
  fillColor: string | null;
}
