import { Reducer } from 'react';
import { HekaStateType, HekaActionType } from '../types';

export const hekaState: HekaStateType = {
  enabledPlatforms: [],
  connections: null,
  isLoading: false,
  error: '',
};

export const hekaReducer: Reducer<HekaStateType, HekaActionType> = (
  state,
  action
) => {
  switch (action.type) {
    case 'APP_ERROR':
      return {
        ...state,
        error: action.payload?.error || 'Something went wrong!',
      };
    case 'SET_CONNECTIONS':
      return {
        ...state,
        connections: action.payload.connections,
      };
    case 'SET_ENABLED_PLATFORMS':
      return {
        ...state,
        enabledPlatforms: action.payload.enabledPlatforms,
      };
    case 'SET_ISLOADING':
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };
    default:
      return state;
  }
};
