import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';
import { useConnectPlatformAPI } from '../api/connect';
import { useGetConnectionsAPI } from '../api/getConnections';
import { useGetUserAppsAPI } from '../api/getUserApps';
import { QueryKeys } from '../constants/queryKeys';
import { useAppleHealthkit } from '../hooks/appleHealthkit';
import { useFitbit } from '../hooks/fitbit';
import { useGoogleFit } from '../hooks/googleFit';
import { useStrava } from '../hooks/strava';
import { HekaProvider, ProviderSignIn } from '../types';
import { AppContext } from '../utils/AppContext';
import { getPlatforms } from '../utils/Platforms';
import { getUniqueId } from 'react-native-device-info';

interface HomeParams {
  appKey: string;
  userUUID: string;
}

export const useHekaHealthButtons = ({ appKey, userUUID }: HomeParams) => {
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
  const platforms = getPlatforms(connections);

  const { signIn: signInFitbit } = useFitbit();
  const { signIn: signInGoogleFit } = useGoogleFit();
  const { signIn: signInStrava } = useStrava();
  const {
    requestAuthorization: requestAuthorizationAppleHealthkit,
    syncIosHealthData: syncIosHealthDataAppleHealthKit,
    stopSyncing: stopSyncingAppleHealthkit,
  } = useAppleHealthkit();

  const platformAuthorizeMap: Record<HekaProvider, ProviderSignIn> = {
    fitbit: signInFitbit,
    strava: signInStrava,
    google_fit: signInGoogleFit,
    apple_healthkit: requestAuthorizationAppleHealthkit,
  };

  const handleConnect = async ({
    platformName,
  }: {
    platformName: HekaProvider;
  }) => {
    try {
      const platform = enabledPlatforms?.find(
        (enabledPlatform) => enabledPlatform.platform_name === platformName
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

      const deviceID = await getUniqueId();

      await connectPlatformAPI({
        appKey,
        userUUID,
        platformName,
        device_id: deviceID,
        email: result.email,
        refresh_token: result.refreshToken,
      });

      if (platform.platform_name === 'apple_healthkit') {
        const syncResult = await syncIosHealthDataAppleHealthKit({
          appKey,
          userUUID,
        });

        if (syncResult.error) {
          dispatch({
            type: 'APP_ERROR',
            payload: { error },
          });
        }
      }

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
    platformName: HekaProvider;
  }) => {
    try {
      const platform = enabledPlatforms?.find(
        (enabledPlatform) => enabledPlatform.platform_name === platformName
      );

      if (!platform) {
        dispatch({
          type: 'APP_ERROR',
          payload: { error: 'Invalid platform' },
        });
        return;
      }

      const deviceID = await getUniqueId();

      await connectPlatformAPI({
        appKey,
        userUUID,
        platformName,
        device_id: deviceID,
        isDisconnect: true,
      });

      if (platform.platform_name === 'apple_healthkit') {
        await stopSyncingAppleHealthkit();
      }

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
    platforms,
    handleConnect,
    handleDisconnect,
  };
};
