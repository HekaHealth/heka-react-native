import { authorize } from 'react-native-app-auth';

const getRedirectUrl = (clientId: string) => {
  const parts = clientId.split('.');
  return `com.googleusercontent.apps.${parts[0]}:/oauthredirect`;
};

const issuer = 'https://accounts.google.com';

const defaultScopes = [
  'email',
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.blood_glucose.read',
  'https://www.googleapis.com/auth/fitness.blood_pressure.read',
  'https://www.googleapis.com/auth/fitness.body.read',
  'https://www.googleapis.com/auth/fitness.body_temperature.read',
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
  'https://www.googleapis.com/auth/fitness.location.read',
  'https://www.googleapis.com/auth/fitness.nutrition.read',
  'https://www.googleapis.com/auth/fitness.oxygen_saturation.read',
  'https://www.googleapis.com/auth/fitness.reproductive_health.read',
  'https://www.googleapis.com/auth/fitness.sleep.read',
];

export const useGoogleFit = () => {
  const signIn: ProviderSignIn = async (platform) => {
    try {
      const clientId = platform.platform_app_id;
      if (!clientId) {
        return { error: 'clientID is missing' };
      }

      const redirectUrl = getRedirectUrl(clientId);
      console.log({ redirectUrl });
      const result = await authorize({
        issuer,
        clientId,
        redirectUrl,
        scopes: platform.enabled_scopes || defaultScopes,
      });
      console.log({
        refreshToken: result.refreshToken,
        email: result.tokenAdditionalParameters?.['user_id'] || '',
      });

      return {
        result: {
          refreshToken: result.refreshToken,
          email: result.tokenAdditionalParameters?.['user_id'] || '',
        },
      };
    } catch (error) {
      console.error(error);
      return {};
    }
  };

  return { signIn };
};
