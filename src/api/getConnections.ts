import { BaseURL } from '../constants';
import { Connection, HekaProvider } from '../types';

interface Request {
  userUUID: string;
  appKey: string;
}

interface Response {
  success: boolean;
  data: {
    user_uuid: string;
    connections: Record<HekaProvider, Connection> | null;
  };
}

export const getConnectionsAPI = async (
  request: Request
): Promise<Response> => {
  const result = await fetch(
    `${BaseURL}/check_watch_connection?key=${encodeURIComponent(
      request.appKey
    )}&user_uuid=${encodeURIComponent(request.userUUID)}`,
    {
      method: 'GET',
    }
  );

  return await result.json();
};
