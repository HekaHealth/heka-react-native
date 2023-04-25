import axios from 'axios';
import type { Dispatch } from 'react';
import React, { createContext, useEffect, useReducer } from 'react';
import { hekaReducer, hekaState } from './Heka.Store';

export const AppContext = createContext<{
  state: HekaStateType;
  dispatch: Dispatch<HekaActionType>;
}>({ state: hekaState, dispatch: () => null });

interface AppWrapperProps {
  children: React.ReactNode;
}

export const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  const [state, dispatch] = useReducer(hekaReducer, hekaState);

  useEffect(() => {
    (async () => {
      try {
        const connectionResponse = await axios.get(
          'https://heka-backend.delightfulmeadow-20fa0dd3.australiaeast.azurecontainerapps.io/watch_sdk/check_watch_connection?key=948d7579-6476-4ab4-8ed9-53f9a54ad300&user_uuid=abdulmateen075@gmail.com'
        );
        const userAppResponse = await axios.get(
          'https://heka-backend.delightfulmeadow-20fa0dd3.australiaeast.azurecontainerapps.io/watch_sdk/user_app_from_key?key=948d7579-6476-4ab4-8ed9-53f9a54ad300'
        );
        dispatch({
          type: 'FETCH_USER_APP',
          payload: {
            connections: connectionResponse.data.data.connections,
            platforms: userAppResponse.data.data.enabled_platforms,
            types: userAppResponse.data.data.enabled_data_types,
          },
        });
      } catch (error) {
        dispatch({ type: 'FETCH_ERROR', payload: null });
      }
    })();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
