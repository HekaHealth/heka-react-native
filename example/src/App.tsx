import React from 'react';
import { HekaHealthComponent } from '@heka-health/heka-react-native';
import { AppKey, UserUUID } from './constants';

export default function App() {
  return <HekaHealthComponent appKey={AppKey} userUUID={UserUUID} />;
}
