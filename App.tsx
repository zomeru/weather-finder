import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WeatherProvider } from './src/context';

import RootNavigationContainer from './src/navigation/RootNavigationContainer';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WeatherProvider>
        <RootNavigationContainer />
      </WeatherProvider>
    </QueryClientProvider>
  );
}
