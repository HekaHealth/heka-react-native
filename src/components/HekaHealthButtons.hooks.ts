import { useContext, useEffect } from 'react';
import { connectPlatformAPI } from '../api/connect';
import { getConnectionsAPI } from '../api/getConnections';
import { getUserAppsAPI } from '../api/getUserApps';
import { useAppleHealthkit } from '../hooks/appleHealthkit';
import { useFitbit } from '../hooks/fitbit';
import { useGoogleFit } from '../hooks/googleFit';
import { useStrava } from '../hooks/strava';
import { HekaProvider, ProviderSignIn } from '../types';
import { AppContext } from '../contexts/AppContext';
import { getPlatforms } from '../utils/Platforms';
import { getUniqueId } from 'react-native-device-info';

interface HomeParams {
  appKey: string;
  userUUID: string;
}

export const useHekaHealthButtons = ({ appKey, userUUID }: HomeParams) => {
  const { state, dispatch } = useContext(AppContext);

  const platforms = getPlatforms(state.connections);

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

  useEffect(() => {
    (async () => {
      dispatch({ type: 'SET_ISLOADING', payload: { isLoading: true } });

      try {
        const connectResult = await getConnectionsAPI({ appKey, userUUID });
        dispatch({
          type: 'SET_CONNECTIONS',
          payload: { connections: connectResult.data.connections },
        });
      } catch (e: any) {
        dispatch({
          type: 'APP_ERROR',
          payload: { error: e.message || 'Failed to fetch connections' },
        });
      }

      try {
        const connectResult = await getUserAppsAPI({ appKey });
        dispatch({
          type: 'SET_ENABLED_PLATFORMS',
          payload: { enabledPlatforms: connectResult.data.enabled_platforms },
        });
      } catch (e: any) {
        dispatch({
          type: 'APP_ERROR',
          payload: { error: e.message || 'Failed to fetch enabled platforms' },
        });
      }

      dispatch({ type: 'SET_ISLOADING', payload: { isLoading: false } });
    })();
  }, [appKey, userUUID, dispatch]);

  const handleConnect = async ({
    platformName,
  }: {
    platformName: HekaProvider;
  }) => {
    dispatch({ type: 'SET_ISLOADING', payload: { isLoading: true } });

    try {
      const platform = state.enabledPlatforms?.find(
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

      const connectResult = await connectPlatformAPI({
        appKey,
        userUUID,
        platformName,
        device_id: deviceID,
        email: result.email,
        refresh_token: result.refreshToken,
      });

      dispatch({
        type: 'SET_CONNECTIONS',
        payload: { connections: connectResult.data.connections },
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
    } catch (e: any) {
      console.error(e);
      dispatch({
        type: 'APP_ERROR',
        payload: { error: e?.data?.error },
      });
    } finally {
      dispatch({ type: 'SET_ISLOADING', payload: { isLoading: false } });
    }
  };

  const handleDisconnect = async ({
    platformName,
  }: {
    platformName: HekaProvider;
  }) => {
    dispatch({ type: 'SET_ISLOADING', payload: { isLoading: true } });

    try {
      const platform = state.enabledPlatforms?.find(
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

      const connectResult = await connectPlatformAPI({
        appKey,
        userUUID,
        platformName,
        device_id: deviceID,
        isDisconnect: true,
      });

      dispatch({
        type: 'SET_CONNECTIONS',
        payload: { connections: connectResult.data.connections },
      });

      if (platform.platform_name === 'apple_healthkit') {
        await stopSyncingAppleHealthkit();
      }
    } catch (e: any) {
      console.error(e);
      dispatch({
        type: 'APP_ERROR',
        payload: { error: e?.data?.error },
      });
    } finally {
      dispatch({ type: 'SET_ISLOADING', payload: { isLoading: false } });
    }
  };

  return {
    state,
    platforms,
    handleConnect,
    handleDisconnect,
  };
};
