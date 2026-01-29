import { createSelector } from '@reduxjs/toolkit';

import type { StateSchema } from '@/app/providers/StoreProvider';

export const selectCanvasState = (state: StateSchema) => state.canvas;

export const selectUndoStack = (state: StateSchema) => state.canvas?.undoStack ?? [];
export const selectRedoStack = (state: StateSchema) => state.canvas?.redoStack ?? [];
export const selectSessionId = (state: StateSchema) => state.canvas?.sessionId ?? null;
export const selectIsLoading = (state: StateSchema) => state.canvas?.isLoading ?? false;

export const selectCanUndo = createSelector(selectUndoStack, (undoStack) => undoStack.length > 0);

export const selectCanRedo = createSelector(selectRedoStack, (redoStack) => redoStack.length > 0);

export const selectHistoryCount = createSelector(selectUndoStack, (undoStack) => undoStack.length);
