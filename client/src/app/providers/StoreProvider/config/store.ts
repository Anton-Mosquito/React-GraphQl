import { type ReducersMapObject, configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { userReducer } from '@/entities/User';
import { canvasLogger } from '@/features/canvas/model/middleware/canvasLogger';
import canvasReducer from '@/features/canvas/model/slices/canvasSlice';
import toolsReducer from '@/features/canvas/model/slices/toolsSlice';
import { $api } from '@/shared/api/api';
import { rtkApi } from '@/shared/api/rtkApi';

import { type ThunkExtraArg, type StateSchema } from './StateSchema';
import { createReducerManager } from './reducerManager';

const persistedToolsReducer = persistReducer(
  {
    key: 'tools',
    storage,
    whitelist: ['strokeColor', 'lineWidth', 'selectedTool'],
  },
  toolsReducer,
);

export function createReduxStore(
  initialState?: StateSchema,
  asyncReducers?: ReducersMapObject<StateSchema>,
) {
  const rootReducers: ReducersMapObject<StateSchema> = {
    ...asyncReducers,
    user: userReducer,
    canvas: canvasReducer,
    tools: persistedToolsReducer,
    [rtkApi.reducerPath]: rtkApi.reducer,
  };

  const reducerManager = createReducerManager(rootReducers);

  const extraArg: ThunkExtraArg = {
    api: $api,
  };

  const store = configureStore({
    reducer: reducerManager.reduce as ReducersMapObject<StateSchema>,
    devTools: import.meta.env.NODE_ENV === 'development',
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: extraArg,
        },
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, 'canvas/addToHistory'],
          ignoredPaths: ['canvas.currentDrawing'],
        },
      })
        .concat(rtkApi.middleware)
        .concat(canvasLogger),
  });

  store.reducerManager = reducerManager;

  return store;
}

export const persistor = persistStore(createReduxStore());
export type RootState = ReturnType<typeof createReduxStore.getState>;
export type AppDispatch = ReturnType<typeof createReduxStore>['dispatch'];
