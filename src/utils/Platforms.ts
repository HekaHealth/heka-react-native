import { Platform } from 'react-native';
import { Connection, HekaProvider } from '../types';

export const getPlatforms = (
  connections?: Record<HekaProvider, Connection> | null
) => {
  const platforms = connections
    ? (Object.keys(connections) as HekaProvider[])
    : [];

  switch (Platform.OS) {
    case 'android':
    case 'windows':
      return platforms.filter((platform) => platform !== 'apple_healthkit');

    case 'ios':
    case 'macos':
      return platforms.filter((platform) => platform !== 'google_fit');

    default:
      return platforms;
  }
};
