import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { WeatherProvider } from './context';
import { ForecastData, WeatherData } from './types';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
});

export const TestWrapper: React.FC<{ children: React.ReactNode }> = ({
  children
}) => (
  <QueryClientProvider client={queryClient}>
    <WeatherProvider>
      <NavigationContainer>{children}</NavigationContainer>
    </WeatherProvider>
  </QueryClientProvider>
);

export const mockWeatherData: WeatherData = {
  name: 'London',
  sys: { country: 'GB' },
  main: {
    temp: 20,
    feels_like: 22,
    humidity: 70,
    temp_min: 18,
    temp_max: 23,
    pressure: 1010
  },
  weather: [{ main: 'Clear', description: 'clear sky', icon: '01d', id: 800 }],
  wind: { speed: 5, deg: 180 },
  dt: 1642341600
};

export const mockForecastData: ForecastData = {
  // generate sample data based on type
  list: Array(7).fill({
    dt: 1642341600,
    main: {
      temp: 20,
      feels_like: 22,
      temp_min: 18,
      temp_max: 23,
      pressure: 1010,
      humidity: 70
    },
    weather: [
      { main: 'Clear', description: 'clear sky', icon: '01d', id: 800 }
    ],
    wind: { speed: 5, deg: 180 },
    dt_txt: '2022-01-16 12:00:00'
  }),
  city: {
    id: 2643743,
    name: 'London',
    country: 'GB'
  }
};
