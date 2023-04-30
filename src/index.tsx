import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { HekaHealthButtons } from './components/HekaHealthButtons';
import { AppWrapper } from './utils/AppContext';

const queryClient = new QueryClient();

interface HekaHealthComponentProps {
  appKey: string;
  userUUID: string;
}

export const HekaHealthComponent = ({
  appKey,
  userUUID,
}: HekaHealthComponentProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppWrapper>
        <HekaHealthButtons appKey={appKey} userUUID={userUUID} />
      </AppWrapper>
    </QueryClientProvider>
  );
};

export default HekaHealthComponent;
