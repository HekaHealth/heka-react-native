import { useMutation } from '@tanstack/react-query';
import { api } from './index';
import { HekaProvider, Connection } from '../types';

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
  const result = await api.post(
    `/connect_platform_for_user`,
    {
      platform: request.platformName,
      device_id: request.device_id,
      refresh_token: request.refresh_token,
      email: request.email,
      disconnect: Boolean(request.isDisconnect),
    },
    {
      params: {
        key: request.appKey,
        user_uuid: request.userUUID,
      },
    }
  );

  return result.data;
};

export const useConnectPlatformAPI = () => {
  return useMutation(connectPlatformAPI);
};
