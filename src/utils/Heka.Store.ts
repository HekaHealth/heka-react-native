import { hekaStateType, hekaActionType } from "../types";

export const hekaState: hekaStateType = {
  loading: true,
  error: "",
  connections: null,
  enabled_platforms: null,
  enabled_data_types: null,
};

export const hekaReducer = (state: hekaStateType, action: hekaActionType) => {
  switch (action.type) {
    case "FETCH_USER_APP":
      return {
        loading: false,
        connections: action.payload.connections,
        enabled_platforms: action.payload.platforms,
        enabled_data_types: action.payload.types,
        error: "",
      };
    case "FETCH_ERROR":
      return {
        loading: false,
        data: {},
        error: "Something went wrong!",
      };
    default:
      return state;
  }
};
