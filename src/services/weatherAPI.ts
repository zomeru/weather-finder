import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { WeatherData, ForecastData } from '../types';
import { loadOfflineDataByCity } from '../lib/storage';

const API_KEY = process.env.OPEN_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchWeather = async (city: string): Promise<WeatherData> => {
  try {
    const netInfo = await NetInfo.fetch();

    if (netInfo.isConnected) {
      const response = await axios.get<WeatherData>(`${BASE_URL}/weather`, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric'
        }
      });

      return response.data;
    } else {
      const offlineDataByCity = await loadOfflineDataByCity(city);

      if (offlineDataByCity?.weather) {
        return offlineDataByCity.weather;
      }

      throw new Error('No internet connection and no offline data available.');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch weather data'
      );
    }
    throw new Error('Failed to fetch weather data');
  }
};

export const fetchForecast = async (city: string): Promise<ForecastData> => {
  try {
    const netInfo = await NetInfo.fetch();

    if (netInfo.isConnected) {
      const response = await axios.get<ForecastData>(`${BASE_URL}/forecast`, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric'
        }
      });

      return response.data;
    } else {
      const offlineDataByCity = await loadOfflineDataByCity(city);

      if (offlineDataByCity?.forecast) {
        return offlineDataByCity.forecast;
      }

      throw new Error(
        'No internet connection and no offline forecast data available.'
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch forecast data'
      );
    }
    throw new Error('Failed to fetch forecast data');
  }
};
