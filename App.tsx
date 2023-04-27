import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './src/screen/Home';
import { AppWrapper } from './src/utils/AppContext';
import { AppKey, UserUUID } from './src/constants';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppWrapper>
        <Home appKey={AppKey} userUUID={UserUUID} />
      </AppWrapper>
    </QueryClientProvider>
  );
}
