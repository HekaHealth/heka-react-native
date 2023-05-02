export type HekaProvider =
  | 'fitbit'
  | 'strava'
  | 'google_fit'
  | 'apple_healthkit';

export type Platform = {
  id: number;
  platform_name: HekaProvider;
  platform_app_id: string | null;
  platform_app_secret: string | null;
  enabled_scopes: Array<string> | null;
  sync_manual_entries: boolean;
};

export type Connection = {
  platform_name: string;
  last_sync: string | null;
  logged_in: boolean;
  connected_device_uuids: Array<string>;
};

export type DataType = {
  name: string;
  id: number;
};

export type HekaStateType = {
  error: string;
};

export type HekaActionType = {
  type: 'APP_ERROR';
  payload?: { error?: string };
};

export type SignInParams = {
  clientId: string;
  enabledScopes: string[];
};

export type ProviderSignIn = (platform: Platform) => Promise<{
  result?: {
    refreshToken: string;
    email: string;
  };
  error?: string;
}>;
