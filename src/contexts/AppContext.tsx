import type { Dispatch } from 'react';
import React, { createContext, useReducer } from 'react';
import { hekaReducer, hekaState } from './Heka.Store';
import { HekaStateType, HekaActionType } from '../types';

export const AppContext = createContext<{
  state: HekaStateType;
  dispatch: Dispatch<HekaActionType>;
}>({ state: hekaState, dispatch: () => null });

interface AppWrapperProps {
  children: React.ReactNode;
}

export const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  const [state, dispatch] = useReducer(hekaReducer, hekaState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
