import {
  type SliceCaseReducers,
  type SliceSelectors,
  createSlice,
  type CreateSliceOptions,
  bindActionCreators,
  type CaseReducerActions,
  type Slice,
} from '@reduxjs/toolkit';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

export function buildSlice<
  State,
  CaseReducers extends SliceCaseReducers<State>,
  Name extends string,
  Selectors extends SliceSelectors<State>,
  ReducerPath extends string = Name,
>(
  options: CreateSliceOptions<State, CaseReducers, Name, ReducerPath, Selectors>,
): Slice<State, CaseReducers, Name, ReducerPath, Selectors> & {
  useActions: () => CaseReducerActions<CaseReducers, Name>;
} {
  const slice = createSlice(options);

  const useActions = (): CaseReducerActions<CaseReducers, Name> => {
    const dispatch = useDispatch();

    return useMemo(() => bindActionCreators(slice.actions, dispatch), [dispatch]);
  };

  return {
    ...slice,
    useActions,
  };
}
