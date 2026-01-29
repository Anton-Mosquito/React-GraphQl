import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { ToolType } from '../types/canvas';

interface ToolsState {
  selectedTool: ToolType;
  strokeColor: string;
  lineWidth: number;
  fillColor: string | null;
}

const initialState: ToolsState = {
  selectedTool: 'brush',
  strokeColor: '#000000',
  lineWidth: 5,
  fillColor: null,
};

export const toolsSlice = createSlice({
  name: 'tools',
  initialState,
  reducers: {
    setTool: (state, action: PayloadAction<ToolType>) => {
      state.selectedTool = action.payload;
      if (action.payload === 'eraser') {
        state.strokeColor = '#FFFFFF';
      }
    },

    setStrokeColor: (state, action: PayloadAction<string>) => {
      state.strokeColor = action.payload;
    },

    setLineWidth: (state, action: PayloadAction<number>) => {
      state.lineWidth = action.payload;
    },

    setFillColor: (state, action: PayloadAction<string | null>) => {
      state.fillColor = action.payload;
    },

    resetTools: () => {
      return initialState;
    },
  },
});

export const { setTool, setStrokeColor, setLineWidth, setFillColor, resetTools } =
  toolsSlice.actions;

export default toolsSlice.reducer;
