import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';
import { useConnectPlatformAPI } from '../api/connect';
import { useGetConnectionsAPI } from '../api/getConnections';
import { useGetUserAppsAPI } from '../api/getUserApps';
import { QueryKeys } from '../constants/queryKeys';
import { useFitbit } from '../hooks/fitbit';
import { useGoogleFit } from '../hooks/googleFit';
import { AppContext } from '../utils/AppContext';

interface HomeParams {
  appKey: string;
  userUUID: string;
}

export const useHome = ({ appKey, userUUID }: HomeParams) => {
  const { state, dispatch } = useContext(AppContext);

  const queryClient = useQueryClient();

  const { data: connectionsResponse, isLoading: isLoadingConnections } =
    useGetConnectionsAPI({
      appKey,
      userUUID,
    });
  const { data: userAppsResponse, isLoading: isLoadingUserApps } =
    useGetUserAppsAPI({
      appKey,
    });

  const {
    mutateAsync: connectPlatformAPI,
    isLoading: isLoadingConnectPlatform,
  } = useConnectPlatformAPI();

  const connections = connectionsResponse?.data?.connections;
  const enabledPlatforms = userAppsResponse?.data?.enabled_platforms || [];

  const { signIn: signInFitbit } = useFitbit();
  const { signIn: signInGoogleFit } = useGoogleFit();

  const platformAuthorizeMap: Record<Provider, ProviderSignIn> = {
    fitbit: signInFitbit,
    strava: signInFitbit,
    google_fit: signInGoogleFit,
    apple_healthkit: signInFitbit,
  };

  const handleConnect = async ({
    platformName,
  }: {
    platformName: Provider;
  }) => {
    try {
      const platform = enabledPlatforms?.find(
        (platform) => platform.platform_name === platformName
      );

      if (!platform) {
        dispatch({
          type: 'APP_ERROR',
          payload: { error: 'Invalid platform' },
        });
        return;
      }

      const authorize = platformAuthorizeMap[platform.platform_name];
      const { result, error } = await authorize(platform);

      if (!result || error) {
        dispatch({
          type: 'APP_ERROR',
          payload: {
            error: error || 'Failed to sign in, please verify your credentials',
          },
        });
        return;
      }

      const result2 = await connectPlatformAPI({
        appKey,
        userUUID,
        platformName,
        email: 'abdulmateen075@gmail.com',
        refresh_token: result.refreshToken,
      });

      console.log({ result2: result2.data.connections?.[platformName] });

      await queryClient.invalidateQueries([QueryKeys.CONNECTIONS]);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        dispatch({
          type: 'APP_ERROR',
          payload: { error: error.response?.data?.error },
        });
        return;
      }

      dispatch({ type: 'APP_ERROR' });
    }
  };

  const handleDisconnect = async ({
    platformName,
  }: {
    platformName: Provider;
  }) => {
    try {
      const platform = enabledPlatforms?.find(
        (platform) => platform.platform_name === platformName
      );

      if (!platform) {
        dispatch({
          type: 'APP_ERROR',
          payload: { error: 'Invalid platform' },
        });
        return;
      }

      await connectPlatformAPI({
        appKey,
        userUUID: 'abdulmateen075@gmail.com',
        platformName,
        isDisconnect: true,
      });

      await queryClient.invalidateQueries([QueryKeys.CONNECTIONS]);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        dispatch({
          type: 'APP_ERROR',
          payload: { error: error.response?.data?.error },
        });
        return;
      }

      dispatch({ type: 'APP_ERROR' });
    }
  };

  return {
    isLoadingConnections,
    isLoadingUserApps,
    isLoadingConnectPlatform,
    state,
    connections,
    handleConnect,
    handleDisconnect,
  };
};
