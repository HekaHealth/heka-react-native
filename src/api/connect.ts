import { HekaProvider, Connection } from '../types';
import { BaseURL } from '../constants';

interface ConnectRequest {
  appKey: string;
  userUUID: string;
  platformName: string;
  device_id?: string;
  refresh_token?: string;
  email?: string;
  isDisconnect?: boolean;
}

export interface ConnectResponse {
  success: boolean;
  data: {
    connections: Record<HekaProvider, Connection> | null;
    user_uuid: string;
  };
}

export const connectPlatformAPI = async (
  request: ConnectRequest
): Promise<ConnectResponse> => {
  const result = await fetch(
    `${BaseURL}/connect_platform_for_user?key=${encodeURIComponent(
      request.appKey
    )}&user_uuid=${encodeURIComponent(request.userUUID)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        platform: request.platformName,
        device_id: request.device_id,
        refresh_token: request.refresh_token,
        email: request.email,
        disconnect: Boolean(request.isDisconnect),
      }),
    }
  );

  return await result.json();
};
