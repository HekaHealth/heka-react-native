import { NativeModules } from 'react-native';

const { HekaHealthPlugin } = NativeModules;

interface SyncIosHealthDataParams {
  appKey: string;
  userUUID: string;
}

export const useAppleHealthkit = () => {
  const requestAuthorization = async () => {
    try {
      await HekaHealthPlugin.requestAuthorization();
      return {
        result: {
          refreshToken: '',
          email: '',
        },
      };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const syncIosHealthData = async ({
    appKey,
    userUUID,
  }: SyncIosHealthDataParams) => {
    try {
      await HekaHealthPlugin.syncIosHealthData(appKey, userUUID);
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const stopSyncing = async () => {
    try {
      await HekaHealthPlugin.stopSyncing();
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  return { requestAuthorization, syncIosHealthData, stopSyncing };
};
