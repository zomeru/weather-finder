import React from 'react';
import { View, Animated, ScrollView } from 'react-native';
import { Text, Icon, Divider } from '@rneui/themed';
import { WeatherData, ForecastData, TemperatureUnit } from '../types';
import tw from '../lib/tailwind';

export interface WeatherDisplayProps {
  weather: WeatherData;
  forecast: ForecastData;
  tempUnit: TemperatureUnit;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({
  weather,
  forecast,
  isFavorite,
  onToggleFavorite,
  tempUnit
}) => {
  const spinValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start();
  }, [weather]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const convertTemp = (celsius: number): number => {
    return tempUnit === 'celsius' ? celsius : (celsius * 9) / 5 + 32;
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <View>
      <View
        style={tw.style('flex-row items-center mb-6 px-5', {
          justifyContent: onToggleFavorite ? 'space-between' : 'center',
          marginTop: onToggleFavorite ? 0 : 16
        })}
      >
        <Text
          style={tw`text-xl font-bold text-gray-800 dark:text-white`}
          testID='location'
        >
          {weather.name}, {weather.sys.country}
        </Text>
        {onToggleFavorite && (
          <Icon
            name={isFavorite ? 'favorite' : 'favorite-border'}
            onPress={onToggleFavorite}
            color={isFavorite ? '#f43f5e' : '#9ca3af'}
            size={24}
          />
        )}
      </View>

      <Animated.View
        style={[tw`items-center my-6`, { transform: [{ rotate: spin }] }]}
        testID='weather-icon-container'
      >
        <Icon
          name={getWeatherIcon(weather.weather[0].main)}
          type='material-community'
          size={64}
          color='#60a5fa'
          testID='weather-icon'
        />
      </Animated.View>

      <Text
        style={tw`text-4xl font-bold text-center text-gray-900 dark:text-white mb-2`}
        testID='temperature'
      >
        {Math.round(convertTemp(weather.main.temp))}°
        {tempUnit === 'celsius' ? 'C' : 'F'}
      </Text>

      <Text
        style={tw`text-lg text-center text-gray-600 dark:text-gray-300 mb-6 capitalize`}
        testID='weather-description'
      >
        {weather.weather[0].description}
      </Text>

      <View style={tw`flex-row justify-between mb-6 px-5`}>
        <View style={tw`items-center`}>
          <Text
            style={tw`text-gray-500 dark:text-gray-400`}
            testID='humidity-label'
          >
            Humidity
          </Text>
          <Text
            style={tw`text-lg font-semibold text-gray-800 dark:text-white`}
            testID='humidity-value'
          >
            {weather.main.humidity}%
          </Text>
        </View>
        <View style={tw`items-center`}>
          <Text
            style={tw`text-gray-500 dark:text-gray-400`}
            testID='wind-label'
          >
            Wind
          </Text>
          <Text
            style={tw`text-lg font-semibold text-gray-800 dark:text-white`}
            testID='wind-value'
          >
            {weather.wind.speed} m/s
          </Text>
        </View>
        <View style={tw`items-center`}>
          <Text
            style={tw`text-gray-500 dark:text-gray-400`}
            testID='feels-like-label'
          >
            Feels like
          </Text>
          <Text
            style={tw`text-lg font-semibold text-gray-800 dark:text-white`}
            testID='feels-like-value'
          >
            {Math.round(convertTemp(weather.main.feels_like))}°
          </Text>
        </View>
      </View>

      <Divider style={tw`my-6`} />

      {/* 7-Day Forecast */}
      <Text
        style={tw`text-xl font-bold text-gray-800 dark:text-white mb-4 px-5`}
        testID='forecast-title'
      >
        7-Day Forecast
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={tw`-mx-4 px-5`}
        contentContainerStyle={tw`px-4`}
      >
        {forecast.list
          .filter((_, index) => index % 8 === 0)
          .slice(0, 7)
          .map((day, index) => (
            <View
              key={index}
              style={tw`mr-4 bg-gray-200 dark:bg-gray-700 rounded-lg p-3 w-28 items-center`}
              testID={`forecast-item-${index}`} // Add dynamic testIDs for each forecast item
            >
              <Text
                style={tw`text-sm text-gray-600 dark:text-gray-300 mb-2`}
                testID={`forecast-date-${index}`}
              >
                {formatDate(day.dt)}
              </Text>
              <Icon
                name={getWeatherIcon(day.weather[0].main)}
                type='material-community'
                size={32}
                color='#60a5fa'
                testID={`forecast-weather-icon-${index}`}
              />
              <Text
                style={tw`text-lg font-bold text-gray-800 dark:text-white my-2`}
                testID={`forecast-temperature-${index}`}
              >
                {Math.round(convertTemp(day.main.temp))}°
              </Text>
              <Text
                style={tw`text-xs text-gray-500 dark:text-gray-400 text-center`}
                testID={`forecast-condition-${index}`}
              >
                {day.weather[0].main}
              </Text>
              <View style={tw`flex-row justify-between w-full mt-2`}>
                <Text
                  style={tw`text-xs text-gray-500 dark:text-gray-400`}
                  testID={`forecast-high-${index}`}
                >
                  H:{Math.round(convertTemp(day.main.temp_max))}°
                </Text>
                <Text
                  style={tw`text-xs text-gray-500 dark:text-gray-400`}
                  testID={`forecast-low-${index}`}
                >
                  L:{Math.round(convertTemp(day.main.temp_min))}°
                </Text>
              </View>
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

const getWeatherIcon = (condition: string): string => {
  switch (condition.toLowerCase()) {
    case 'clear':
      return 'weather-sunny';
    case 'clouds':
      return 'weather-cloudy';
    case 'rain':
      return 'weather-rainy';
    case 'snow':
      return 'weather-snowy';
    case 'thunderstorm':
      return 'weather-lightning';
    case 'drizzle':
      return 'weather-pouring';
    case 'mist':
    case 'fog':
      return 'weather-fog';
    default:
      return 'weather-cloudy';
  }
};

export default WeatherDisplay;
