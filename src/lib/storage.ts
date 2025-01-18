import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ForecastData,
  TemperatureUnit,
  WeatherData,
  WeatherState
} from '../types';

export const saveTempUnit = async (tempUnit: TemperatureUnit) => {
  try {
    await AsyncStorage.setItem('tempUnit', tempUnit);
  } catch (error) {
    console.error('Error saving temp unit', error);
  }
};

export const loadTempUnit = async (): Promise<TemperatureUnit | null> => {
  try {
    const tempUnit = await AsyncStorage.getItem('tempUnit');
    return tempUnit as TemperatureUnit;
  } catch (error) {
    console.error('Error loading temp unit', error);
    return 'celsius'; // Default to celsius
  }
};

export const saveWeatherData = async (weather: WeatherState['offlineData']) => {
  try {
    await AsyncStorage.setItem('offlineData', JSON.stringify(weather));
  } catch (error) {
    console.error('Error saving weather state', error);
  }
};

export const loadOfflineWeatherData = async (): Promise<
  WeatherState['offlineData'] | null
> => {
  try {
    const weatherState = await AsyncStorage.getItem('offlineData');
    return weatherState ? JSON.parse(weatherState) : {};
  } catch (error) {
    console.error('Error loading weather state', error);
    return {};
  }
};

export const updateFavorites = async (city: string) => {
  try {
    let currentFavorites = await loadFavorites();
    if (!currentFavorites.length) {
      await AsyncStorage.setItem('favorites', JSON.stringify([city]));
    } else {
      const newFavorites = currentFavorites.includes(city)
        ? currentFavorites.filter(item => item !== city)
        : [...currentFavorites, city];
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    }
  } catch (error) {
    console.error('Error saving favorites', error);
  }
};

export const loadFavorites = async (): Promise<WeatherState['favorites']> => {
  try {
    const favorites = await AsyncStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error loading favorites', error);
    return [];
  }
};

export const removeFavorite = async (city: string) => {
  try {
    let currentFavorites = await loadFavorites();
    if (currentFavorites.length) {
      const newFavorites = currentFavorites.filter(item => item !== city);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    }
  } catch (error) {
    console.error('Error removing favorite', error);
  }
};

export const loadOfflineData = async (): Promise<
  WeatherState['offlineData']
> => {
  try {
    const offlineData = await AsyncStorage.getItem('offlineData');
    return offlineData ? JSON.parse(offlineData) : {};
  } catch (error) {
    console.error('Error loading offline data', error);
    return {};
  }
};

export const saveOfflineDataByCity = async (
  city: string,
  data: {
    weather: WeatherData;
    forecast: ForecastData;
  }
) => {
  try {
    const offlineData = await loadOfflineData();
    await AsyncStorage.setItem(
      'offlineData',
      JSON.stringify({
        ...offlineData,
        [city]: data
      })
    );
  } catch (error) {
    console.error('Error saving offline data by city', error);
  }
};

export const loadOfflineDataByCity = async (
  city: string
): Promise<{
  weather: WeatherData;
  forecast: ForecastData;
} | null> => {
  try {
    const offlineData = await loadOfflineData();
    return offlineData[city] || null;
  } catch (error) {
    console.error('Error loading offline data by city', error);
    return null;
  }
};
