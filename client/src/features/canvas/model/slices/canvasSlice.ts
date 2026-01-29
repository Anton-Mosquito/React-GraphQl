import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { DrawFigure } from '../types/canvas';

interface CanvasState {
  undoStack: DrawFigure[];
  redoStack: DrawFigure[];
  sessionId: string | null;
  isLoading: boolean;
}

const initialState: CanvasState = {
  undoStack: [],
  redoStack: [],
  sessionId: null,
  isLoading: false,
};

export const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
    },

    addToHistory: (state, action: PayloadAction<DrawFigure>) => {
      state.undoStack.push(action.payload);
      state.redoStack = [];
    },

    undo: (state) => {
      if (state.undoStack.length > 0) {
        const lastAction = state.undoStack.pop()!;
        state.redoStack.push(lastAction);
      }
    },

    redo: (state) => {
      if (state.redoStack.length > 0) {
        const action = state.redoStack.pop()!;
        state.undoStack.push(action);
      }
    },

    loadHistory: (state, action: PayloadAction<DrawFigure[]>) => {
      state.undoStack = action.payload;
      state.redoStack = [];
    },

    clearCanvas: (state) => {
      state.undoStack = [];
      state.redoStack = [];
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setSessionId, addToHistory, undo, redo, loadHistory, clearCanvas, setLoading } =
  canvasSlice.actions;

export default canvasSlice.reducer;
