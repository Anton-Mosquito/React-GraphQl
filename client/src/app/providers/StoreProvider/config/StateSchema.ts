import {
  type ReducersMapObject,
  type EnhancedStore,
  type Action,
  type Reducer,
} from '@reduxjs/toolkit';
import { type AxiosInstance } from 'axios';

import { type UserSchema } from '@/entities/User';
import type { CanvasSchema, ToolsSchema } from '@/features/canvas';
import { type rtkApi } from '@/shared/api/rtkApi';

import { type LoginSchema } from '@/features/AuthByUsername';

export interface StateSchema {
  user: UserSchema;
  [rtkApi.reducerPath]: ReturnType<typeof rtkApi.reducer>;

  canvas: CanvasSchema;
  tools: ToolsSchema;

  loginForm?: LoginSchema;
}

export type StateSchemaKey = keyof StateSchema;
export type MountedReducers = OptionalRecord<StateSchemaKey, boolean>;

export interface ReducerManager {
  getReducerMap: () => ReducersMapObject<StateSchema>;
  reduce: (state: StateSchema, action: Action) => StateSchema;
  add: (key: StateSchemaKey, reducer: Reducer) => void;
  remove: (key: StateSchemaKey) => void;
  // true - mounted, false - unmounted
  getMountedReducers: () => MountedReducers;
}

export interface ReduxStoreWithManager extends EnhancedStore<StateSchema> {
  reducerManager: ReducerManager;
}

export interface ThunkExtraArg {
  api: AxiosInstance;
}

export interface ThunkConfig<T> {
  rejectValue: T;
  extra: ThunkExtraArg;
  state: StateSchema;
}
