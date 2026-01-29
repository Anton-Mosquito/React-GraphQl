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
