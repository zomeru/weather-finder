import React, { useState } from 'react';
import { View, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { SearchBar, Icon, Text, Switch } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueries } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { useAppColorScheme } from 'twrnc';
import { useWeather } from '../context/WeatherContext';
import { WeatherData, ForecastData, ScreenNavigationProp } from '../types';
import { fetchForecast, fetchWeather } from '../services';
import tw from '../lib/tailwind';
import { WeatherDisplay } from '../components';

import {
  saveOfflineDataByCity,
  saveTempUnit,
  updateFavorites
} from '../lib/storage';

const HomeScreen = () => {
  const [search, setSearch] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const { state, dispatch } = useWeather();
  const fadeAnim = new Animated.Value(0);
  const [heartScale] = useState(new Animated.Value(1));

  const [isVisible, setIsVisible] = useState(false);

  const navigation = useNavigation<ScreenNavigationProp>();
  const [colorScheme, toggleColorScheme, _setColorScheme] =
    useAppColorScheme(tw);

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

  const animateHeart = () => {
    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true
      }),
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true
      })
    ]).start();
  };

  React.useEffect(() => {
    (async () => {
      if (weatherQuery.data && forecastQuery.data) {
        dispatch({
          type: 'SET_OFFLINE_DATA',
          data: {
            ...state.offlineData,
            [city]: {
              weather: weatherQuery.data,
              forecast: forecastQuery.data
            }
          }
        });
        await saveOfflineDataByCity(city, {
          weather: weatherQuery.data,
          forecast: forecastQuery.data
        });
        setIsVisible(true);
      }
    })();
  }, [weatherQuery.data, forecastQuery.data]);

  const handleSearch = (): void => {
    if (search.trim()) {
      setCity(search);
      fadeAnim.setValue(0);
    }
  };

  return (
    <View style={tw`flex-1 bg-white dark:bg-gray-900`}>
      <ScrollView contentContainerStyle={tw`pb-24`}>
        {/* Header Section */}
        <View style={tw`px-4 pt-2 pb-4 bg-white dark:bg-gray-900`}>
          {/* Search Bar with Integrated Favorites */}
          <View style={tw`relative mb-6`}>
            <SearchBar
              placeholder='Search for a city...'
              onChangeText={setSearch}
              value={search}
              platform='default'
              onSubmitEditing={handleSearch}
              containerStyle={tw`bg-transparent border-0 shadow-none p-0 m-0 border-b-0 border-t-0`}
              inputContainerStyle={tw`bg-gray-100 dark:bg-gray-800 rounded-xl h-12 border-0 shadow-none`}
              inputStyle={tw`text-base text-gray-800 dark:text-white mx-2`}
              searchIcon={{
                type: 'feather',
                name: 'search',
                color: '#9CA3AF',
                size: 20,
                style: tw`ml-3`
              }}
              placeholderTextColor='#9CA3AF'
              rightIcon={
                <Icon
                  name='heart'
                  type='feather'
                  color='#9CA3AF'
                  size={20}
                  containerStyle={tw`mr-3`}
                  onPress={() => navigation.navigate('Favorites')}
                />
              }
              rightIconContainerStyle={tw`pr-12`}
            />
            <Animated.View
              style={[
                tw`absolute right-2 top-1`,
                { transform: [{ scale: heartScale }] }
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  animateHeart();
                  navigation.navigate('Favorites');
                }}
                style={tw`p-2`}
              >
                <Icon
                  name='favorite'
                  color={colorScheme === 'dark' ? '#fff' : '#f43f5e'}
                  size={24}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {/* Empty State */}
        {!city && !weatherQuery.data && (
          <View style={tw`p-8 items-center justify-center`}>
            <Icon
              name='cloud'
              size={64}
              color={colorScheme === 'dark' ? '#4B5563' : '#9CA3AF'}
              style={tw`mb-4`}
            />
            <Text
              style={tw`text-lg text-gray-600 dark:text-gray-400 text-center mb-2`}
            >
              Search for your city's weather
            </Text>
            <Text
              style={tw`text-sm text-gray-500 dark:text-gray-500 text-center`}
            >
              Enter a city name to get detailed weather information
            </Text>
          </View>
        )}

        {/* Loading State */}
        {(weatherQuery.isLoading || forecastQuery.isLoading) && (
          <View style={tw`p-8 items-center`}>
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg']
                    })
                  }
                ]
              }}
            >
              <Icon
                name='refresh'
                size={32}
                color={colorScheme === 'dark' ? '#fff' : '#4B5563'}
              />
            </Animated.View>
            <Text style={tw`mt-4 text-gray-600 dark:text-gray-300`}>
              Loading weather data...
            </Text>
          </View>
        )}

        {/* Error State */}
        {(weatherQuery.error || forecastQuery.error) &&
          (!weatherQuery.data || !forecastQuery.data) && (
            <View
              style={tw`p-8 items-center bg-red-100 dark:bg-red-900 mx-4 rounded-lg`}
            >
              <Icon
                name='error'
                size={32}
                color={colorScheme === 'dark' ? '#FCA5A5' : '#DC2626'}
                style={tw`mb-2`}
              />
              <Text style={tw`text-red-600 dark:text-red-200 text-center`}>
                {/* Error loading weather data. Please try again. */}
                {weatherQuery.error?.message == 'city not found'
                  ? 'City not found. Please check the spelling and try again.'
                  : 'Error loading weather data. Please try again'}
              </Text>
            </View>
          )}

        {/* Weather Display */}
        {weatherQuery.data && forecastQuery.data && (
          <Animated.View
            style={[
              tw`mt-0`,
              { opacity: isVisible ? 1 : 0, transition: 'opacity 0.5s ease-in' }
            ]}
          >
            <WeatherDisplay
              weather={weatherQuery.data as WeatherData}
              forecast={forecastQuery.data as ForecastData}
              isFavorite={state.favorites.includes(city)}
              onToggleFavorite={async () => {
                await updateFavorites(city);
                if (state.favorites.includes(city)) {
                  dispatch({ type: 'REMOVE_FAVORITE', city });
                } else {
                  dispatch({ type: 'ADD_FAVORITE', city });
                }
              }}
              tempUnit={state.tempUnit}
            />
          </Animated.View>
        )}
      </ScrollView>

      {/* Fixed Footer */}
      <View
        style={tw`absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-4 pb-6`}
      >
        <View style={tw`flex-row justify-between items-center`}>
          <View style={tw`flex-row items-center`}>
            <Icon
              name={colorScheme === 'dark' ? 'nightlight' : 'wb-sunny'}
              size={24}
              color={colorScheme === 'dark' ? '#fff' : '#374151'}
            />
            <Switch
              value={colorScheme === 'dark'}
              onValueChange={async () => {
                const newColorScheme =
                  colorScheme === 'dark' ? 'light' : 'dark';
                await AsyncStorage.setItem('theme', newColorScheme);
                dispatch({ type: 'TOGGLE_THEME', theme: newColorScheme });
                toggleColorScheme();
              }}
              style={tw`mx-2`}
            />
          </View>

          <View style={tw`flex-row items-center`}>
            <Icon
              name='thermostat'
              size={24}
              color={colorScheme === 'dark' ? '#fff' : '#374151'}
            />
            <Switch
              value={state.tempUnit === 'fahrenheit'}
              onValueChange={async () => {
                const unit =
                  state.tempUnit === 'celsius' ? 'fahrenheit' : 'celsius';
                await saveTempUnit(unit);
                dispatch({
                  type: 'TOGGLE_TEMP_UNIT',
                  tempUnit: unit
                });
              }}
              style={tw`mx-2`}
            />
            <Text style={tw`text-gray-600 dark:text-gray-300 ml-1`}>
              {state.tempUnit === 'celsius' ? '°C' : '°F'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
