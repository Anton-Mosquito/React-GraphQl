import React, { createContext, useReducer } from 'react';

import type { AppState } from './defaultContext';
import { useDefaultContext } from './defaultContext';
import { STORAGE_KEY } from '../../const';
import { saveToStorage } from '../../utils/localStorage';

export type AppAction = { type: 'setLocale'; locale: string } | { type: string };

type AppContextValue = {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

const reducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'setLocale':
      if ('locale' in action) {
        saveToStorage(STORAGE_KEY, action.locale);
        return { ...state, locale: action.locale };
      }
      return state;
    default:
      console.error(`Unhandled action type: ${action.type}`);
      return state;
  }
};

const AppContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const defaultContext = useDefaultContext();
  const [state, dispatch] = useReducer(reducer, defaultContext);
  const value: AppContextValue = { state, dispatch };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppContextProvider };
