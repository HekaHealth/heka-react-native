import { authorize } from 'react-native-app-auth';
import { ProviderSignIn } from '../types';

const redirectUrl = 'hekahealth://fitbit';

const defaultScopes = [
  'activity',
  'cardio_fitness',
  'electrocardiogram',
  'heartrate',
  'location',
  'nutrition',
  'profile',
  'oxygen_saturation',
  'respiratory_rate',
  'sleep',
  'temperature',
  'weight',
  'settings',
];

export const useFitbit = () => {
  const signIn: ProviderSignIn = async (platform) => {
    try {
      const clientId = platform.platform_app_id;
      const clientSecret = platform.platform_app_secret;
      if (!clientId || !clientSecret) {
        return { error: 'missing credentials' };
      }

      const result = await authorize({
        clientId,
        clientSecret,
        redirectUrl,
        serviceConfiguration: {
          authorizationEndpoint: 'https://www.fitbit.com/oauth2/authorize',
          tokenEndpoint: 'https://api.fitbit.com/oauth2/token',
        },
        scopes: platform.enabled_scopes || defaultScopes,
      });

      return {
        result: {
          refreshToken: result.refreshToken,
          email: result.tokenAdditionalParameters?.user_id || '',
        },
      };
    } catch (error) {
      console.error(error);
      return {};
    }
  };

  return { signIn };
};
