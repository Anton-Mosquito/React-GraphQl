import { type ReducersMapObject, configureStore } from '@reduxjs/toolkit';

import { userReducer } from '@/entities/User';
import { $api } from '@/shared/api/api';
import { rtkApi } from '@/shared/api/rtkApi';

import { type ThunkExtraArg, type StateSchema } from './StateSchema';
import { createReducerManager } from './reducerManager';

export function createReduxStore(
  initialState?: StateSchema,
  asyncReducers?: ReducersMapObject<StateSchema>,
) {
  const rootReducers: ReducersMapObject<StateSchema> = {
    ...asyncReducers,
    user: userReducer,
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
      }).concat(rtkApi.middleware),
  });

  store.reducerManager = reducerManager;

  return store;
}

export type RootState = ReturnType<typeof createReduxStore.getState>
export type AppDispatch = ReturnType<typeof createReduxStore>['dispatch'];
