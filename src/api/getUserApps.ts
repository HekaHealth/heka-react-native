import { BaseURL } from '../constants';
import { DataType, Platform } from '../types';

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
  const result = await fetch(
    `${BaseURL}/user_app_from_key?key=${encodeURIComponent(request.appKey)}`,
    {
      method: 'GET',
    }
  );
  return await result.json();
};
