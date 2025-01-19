import { useQueries } from '@tanstack/react-query';
import { fetchForecast, fetchWeather } from '../services';

const useWeatherData = (city = '') => {
  const [weatherQuery, forecastQuery] = useQueries({
    queries: [
      {
        queryKey: ['weather', city],
        queryFn: () => fetchWeather(city),
        enabled: !!city,
        staleTime: 300000
      },
      {
        queryKey: ['forecast', city],
        queryFn: () => fetchForecast(city),
        enabled: !!city,
        staleTime: 300000
      }
    ]
  });

  return { weatherQuery, forecastQuery };
};

export default useWeatherData;
