import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, Icon } from '@rneui/themed';
import { useQueries } from '@tanstack/react-query';
import { useWeather } from '../context/WeatherContext';
import { fetchWeather } from '../services';
import tw from '../lib/tailwind';
import { removeFavorite } from '../lib/storage';

const FavoritesScreen = () => {
  const { state, dispatch } = useWeather();

  const favoritesQueries = useQueries({
    queries: state.favorites.map(city => ({
      queryKey: ['weather', city],
      queryFn: () => fetchWeather(city),
      staleTime: 300000
    }))
  });

  const handleRemoveFavorite = async (city: string) => {
    Alert.alert('Remove City', `Remove ${city} from favorites?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        onPress: () => dispatch({ type: 'REMOVE_FAVORITE', city }),
        style: 'destructive'
      }
    ]);
    await removeFavorite(city);
  };

  const convertTemp = (celsius: number): number => {
    return state.tempUnit === 'celsius' ? celsius : (celsius * 9) / 5 + 32;
  };

  if (state.favorites.length === 0) {
    return (
      <View
        style={tw`flex-1 bg-white dark:bg-gray-900 p-8 items-center justify-center`}
      >
        <Icon
          name='favorite-border'
          size={48}
          color='#9ca3af'
          style={tw`mb-4`}
        />
        <Text style={tw`text-lg text-gray-600 dark:text-gray-300 text-center`}>
          No favorite cities yet
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1 bg-white dark:bg-gray-900`}>
      {state.favorites.map((city, index) => {
        const query = favoritesQueries[index];
        const weather = query.data;

        return (
          <View
            key={city}
            style={tw`px-4 py-3 border-b border-gray-100 dark:border-gray-800`}
          >
            <View style={tw`flex-row justify-between items-start mb-2`}>
              <View>
                <Text
                  style={tw`text-lg font-semibold text-gray-900 dark:text-white`}
                >
                  {city}
                </Text>
                {weather && (
                  <Text style={tw`text-sm text-gray-500 dark:text-gray-400`}>
                    {weather.weather[0].description} •{' '}
                    {Math.round(convertTemp(weather.main.temp))}°
                    {state.tempUnit === 'celsius' ? 'C' : 'F'}
                  </Text>
                )}
              </View>
              <Icon
                name='trash-can-outline'
                type='material-community'
                color='#ef4444'
                size={20}
                onPress={async () => await handleRemoveFavorite(city)}
              />
            </View>

            {weather && (
              <View style={tw`flex-row justify-between mt-2`}>
                <View style={tw`items-center flex-1`}>
                  <Text
                    style={tw`text-xs text-gray-500 dark:text-gray-400 mb-1`}
                  >
                    Humidity
                  </Text>
                  <Text
                    style={tw`text-sm font-medium text-gray-700 dark:text-gray-300`}
                  >
                    {weather.main.humidity}%
                  </Text>
                </View>
                <View style={tw`items-center flex-1`}>
                  <Text
                    style={tw`text-xs text-gray-500 dark:text-gray-400 mb-1`}
                  >
                    Wind
                  </Text>
                  <Text
                    style={tw`text-sm font-medium text-gray-700 dark:text-gray-300`}
                  >
                    {weather.wind.speed} m/s
                  </Text>
                </View>
                <View style={tw`items-center flex-1`}>
                  <Text
                    style={tw`text-xs text-gray-500 dark:text-gray-400 mb-1`}
                  >
                    Feels like
                  </Text>
                  <Text
                    style={tw`text-sm font-medium text-gray-700 dark:text-gray-300`}
                  >
                    {Math.round(convertTemp(weather.main.feels_like))}°
                  </Text>
                </View>
              </View>
            )}

            {query.isLoading && (
              <Text style={tw`text-sm text-gray-500 dark:text-gray-400 mt-2`}>
                Loading weather data...
              </Text>
            )}

            {query.error && !weather && (
              <Text style={tw`text-sm text-red-500 mt-2`}>
                Unable to load weather data
              </Text>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default FavoritesScreen;
