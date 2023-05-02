import { authorize } from 'react-native-app-auth';
import { ProviderSignIn } from '../types';

const redirectUrl = 'hekahealth://strava';

const defaultScopes = ['activity:read'];

export const useStrava = () => {
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
          authorizationEndpoint:
            'https://www.strava.com/oauth/mobile/authorize',
          tokenEndpoint: `https://www.strava.com/oauth/token?client_id=${clientId}&client_secret=${clientSecret}`,
        },
        scopes: platform.enabled_scopes || defaultScopes,
      });

      return {
        result: {
          refreshToken: result.refreshToken,
          email:
            (result.tokenAdditionalParameters?.['athlete'] as any)?.['id'] ||
            '',
        },
      };
    } catch (error) {
      console.error(error);
      return {};
    }
  };

  return { signIn };
};
