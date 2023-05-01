import React from 'react';
import { HekaComponent } from '@heka-health/heka-react-native';
import { AppKey, UserUUID } from './constants';

export default function App() {
  return <HekaComponent appKey={AppKey} userUUID={UserUUID} />;
}
