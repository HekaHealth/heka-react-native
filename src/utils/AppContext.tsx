import React, { createContext, useReducer, useEffect } from "react";
import axios from "axios";
import { StyleSheet } from "react-native";
import { hekaReducer, hekaState } from "./Heka.Store";
import { hekaStateType, hekaActionType } from "../types";
import type { Dispatch } from "react";

export const AppContext = createContext<{
  state: hekaStateType;
  dispatch: Dispatch<hekaActionType>;
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
          "https://heka-backend.delightfulmeadow-20fa0dd3.australiaeast.azurecontainerapps.io/watch_sdk/check_watch_connection?key=7368bad8-aadd-4624-a58c-7e8af2b3cfb7&user_uuid=7895pulkit@test.com"
        );
        const userAppResponse = await axios.get(
          "https://heka-backend.delightfulmeadow-20fa0dd3.australiaeast.azurecontainerapps.io/watch_sdk/user_app_from_key?key=7368bad8-aadd-4624-a58c-7e8af2b3cfb7"
        );
        dispatch({
          type: "FETCH_USER_APP",
          payload: {
            connections: connectionResponse.data.data.connections,
            platforms: userAppResponse.data.data.enabled_platforms,
            types: userAppResponse.data.data.enabled_data_types,
          },
        });
      } catch (error) {
        dispatch({ type: "FETCH_ERROR" });
      }
    })();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }} style={styles.container}>
      {children}
    </AppContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
