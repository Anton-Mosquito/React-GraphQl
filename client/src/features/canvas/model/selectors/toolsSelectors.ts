import type { StateSchema } from '@/app/providers/StoreProvider';

export const selectToolsState = (state: StateSchema) => state.tools;
export const selectSelectedTool = (state: StateSchema) => state.tools?.selectedTool ?? 'brush';
export const selectStrokeColor = (state: StateSchema) => state.tools?.strokeColor ?? '#000000';
export const selectLineWidth = (state: StateSchema) => state.tools?.lineWidth ?? 5;
export const selectFillColor = (state: StateSchema) => state.tools?.fillColor ?? null;
