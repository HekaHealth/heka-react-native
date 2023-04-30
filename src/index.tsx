import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { HekaHealthButtons } from './components/HekaHealthButtons';
import { AppWrapper } from './utils/AppContext';

const queryClient = new QueryClient();

interface HekaHealthAppProps {
  appKey: string;
  userUUID: string;
}

export const HekaHealthApp = ({ appKey, userUUID }: HekaHealthAppProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppWrapper>
        <HekaHealthButtons appKey={appKey} userUUID={userUUID} />
      </AppWrapper>
    </QueryClientProvider>
  );
};

export default HekaHealthApp;
