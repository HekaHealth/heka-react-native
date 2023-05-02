import { ImageSourcePropType } from 'react-native/types';
import { HekaProvider } from '../types';

export const platformsMeta: Record<
  HekaProvider,
  { name: string; logo: ImageSourcePropType }
> = {
  fitbit: {
    name: 'Fitbit',
    logo: require('../images/fitbit.jpg'),
  },
  strava: {
    name: 'Strava',
    logo: require('../images/strava.png'),
  },
  google_fit: {
    name: 'Google Fit',
    logo: require('../images/google_fit.png'),
  },
  apple_healthkit: {
    name: 'Apple Health',
    logo: require('../images/apple_healthkit.png'),
  },
};
