import { api } from '.';
import { AppKey } from '../constants';

interface ConnectRequest {
  platformName: string;
  device_id?: string;
  refresh_token?: string;
  email: string;
  userUUID: string;
}

export interface ConnectResponse {
  success: boolean;
  data: {
    connections: any[];
    user_uuid: string;
  };
}

export const connectPlatformAPI = async (
  request: ConnectRequest
): Promise<ConnectResponse> => {
  const result = await api.post(
    `/connect_platform_for_user`,
    {
      platform: request.platformName,
      device_id: request.device_id,
      refresh_token: request.refresh_token,
      email: request.email,
    },
    {
      params: {
        key: AppKey,
        user_uuid: request.userUUID,
      },
    }
  );

  return result.data;
};
