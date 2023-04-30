import React from 'react';
import { HekaHealthApp } from 'heka-health-react-native-plugin';
import { AppKey, UserUUID } from './constants';

export default function App() {
  return <HekaHealthApp appKey={AppKey} userUUID={UserUUID} />;
}
