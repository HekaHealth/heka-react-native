import React from 'react';
import { HekaHealthButtons } from './components/HekaHealthButtons';
import { AppWrapper } from './contexts/AppContext';

interface HekaComponentProps {
  appKey: string;
  userUUID: string;
}

export const HekaComponent = ({ appKey, userUUID }: HekaComponentProps) => {
  return (
    <AppWrapper>
      <HekaHealthButtons appKey={appKey} userUUID={userUUID} />
    </AppWrapper>
  );
};

export default HekaComponent;
