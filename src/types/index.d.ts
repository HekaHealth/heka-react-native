type Provider = 'fitbit' | 'strava' | 'google_fit' | 'apple_healthkit';

type Platform = {
  id: number;
  platform_name: Provider;
  platform_app_id: string | null;
  platform_app_secret: string | null;
  enabled_scopes: Array<string> | null;
  sync_manual_entries: boolean;
};

type Connection = {
  platform_name: string;
  last_sync: string | null;
  logged_in: boolean;
  connected_device_uuids: Array<string>;
};

type DataType = {
  name: string;
  id: number;
};

type HekaStateType = {
  error: string;
};

type HekaActionType = { type: 'APP_ERROR'; payload?: { error?: string } };

type SignInParams = {
  clientId: string;
  enabledScopes: string[];
};

type ProviderSignIn = (platform: Platform) => Promise<{
  result?: {
    refreshToken: string;
    email: string;
  };
  error?: string;
}>;
