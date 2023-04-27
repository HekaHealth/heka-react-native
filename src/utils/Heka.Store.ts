import { Reducer } from 'react';

export const hekaState: HekaStateType = {
  error: '',
};

export const hekaReducer: Reducer<HekaStateType, HekaActionType> = (
  state,
  action
) => {
  switch (action.type) {
    case 'APP_ERROR':
      return {
        error: action.payload?.error || 'Something went wrong!',
      };
    default:
      return state;
  }
};
