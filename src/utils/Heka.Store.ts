import { Reducer } from 'react';

export const hekaState: HekaStateType = {
  loading: true,
  error: '',
  connections: null,
  enabled_platforms: null,
  enabled_data_types: null,
};

export const hekaReducer: Reducer<HekaStateType, HekaActionType> = (
  state,
  action
) => {
  switch (action.type) {
    case 'FETCH_USER_APP':
      return {
        loading: false,
        connections: action.payload.connections,
        enabled_platforms: action.payload.platforms,
        enabled_data_types: action.payload.types,
        error: '',
      };
    case 'FETCH_ERROR':
      return {
        loading: false,
        connections: state.connections,
        enabled_data_types: state.enabled_data_types,
        enabled_platforms: state.enabled_platforms,
        error: action.payload?.error || 'Something went wrong!',
      };
    default:
      return state;
  }
};
