interface HekaStateType {
  loading: boolean;
  error: string;
  connections: {
    [platform: string]: {
      platform_name: string;
      last_sync: string | null;
      logged_in: boolean;
      connected_device_uuids: string[];
    };
  } | null;
  enabled_platforms:
    | {
        platform_name: string;
        platform_app_id: string | null;
        id: number;
        platform_app_secret: string | null;
        enabled_scopes: string[] | null;
      }[]
    | null;
  enabled_data_types:
    | {
        name: string;
        id: number;
      }[]
    | null;
}

type HekaActionType =
  | { type: 'FETCH_USER_APP'; payload: any }
  | { type: 'FETCH_ERROR'; payload: any };
