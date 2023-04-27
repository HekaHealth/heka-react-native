import {
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { api } from '.';
import { QueryKeys } from '../constants/queryKeys';

interface Request {
  appKey: string;
}

interface Response {
  success: boolean;
  data: {
    id: number;
    enabled_platforms: Array<Platform>;
    enabled_data_types: Array<DataType>;
    created_at: string;
    updated_at: string;
    name: string;
    play_store_url: string | null;
    app_store_url: string | null;
    website: string | null;
    webhook_url: string;
    key: string;
    payment_plan: string;
    debug_store_webhook_logs: boolean;
    tech_stack: any;
    user: number;
    access_users: any[];
  };
}

export const getUserAppsAPI = async (request: Request): Promise<Response> => {
  const result = await api.get(`/user_app_from_key`, {
    params: {
      key: request.appKey,
    },
  });

  return result.data;
};

export const useGetUserAppsAPI = (
  request: Request,
  options?: UseQueryOptions<Response>
): UseQueryResult<Response> => {
  return useQuery(
    [QueryKeys.USER_APPS, request.appKey] as QueryKey,
    () => getUserAppsAPI(request),
    options
  );
};
