import {
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { api } from './index';
import { QueryKeys } from '../constants/queryKeys';
import { HekaProvider, Connection } from '../types';

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
  const result = await api.get(`/check_watch_connection`, {
    params: {
      key: request.appKey,
      user_uuid: request.userUUID,
    },
  });

  return result.data;
};

export const useGetConnectionsAPI = (
  request: Request,
  options?: UseQueryOptions<Response>
): UseQueryResult<Response> => {
  return useQuery(
    [QueryKeys.CONNECTIONS, request.appKey, request.userUUID] as QueryKey,
    () => getConnectionsAPI(request),
    options
  );
};
