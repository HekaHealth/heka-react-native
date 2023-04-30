import React from 'react';
import { HekaHealthComponent } from 'heka-health-react-native-plugin';
import { AppKey, UserUUID } from './constants';

export default function App() {
  return <HekaHealthComponent appKey={AppKey} userUUID={UserUUID} />;
}
