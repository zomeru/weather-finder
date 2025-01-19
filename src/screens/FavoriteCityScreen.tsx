import React, { useEffect } from 'react';
import { View } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList, ScreenNavigationProp } from '../types';
import { WeatherDisplay } from '../components';
import { useWeather } from '../context';
import useWeatherData from '../hooks/useWeatherData';

type FavoriteCityScreenRouteProp = RouteProp<
  RootStackParamList,
  'FavoriteCity'
>;
type FavoriteCityScreenProps = {
  route?: FavoriteCityScreenRouteProp;
};

const FavoriteCityScreen: React.FC<FavoriteCityScreenProps> = ({ route }) => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const { state } = useWeather();
  const { weatherQuery, forecastQuery } = useWeatherData(route?.params?.city);

  useEffect(() => {
    if (route?.params?.city) {
      navigation.setOptions({ title: route.params.city });
    }
  }, [route?.params?.city]);

  return (
    <View>
      {weatherQuery.data && forecastQuery.data && (
        <WeatherDisplay
          weather={weatherQuery.data}
          forecast={forecastQuery.data}
          tempUnit={state.tempUnit}
        />
      )}
    </View>
  );
};

export default FavoriteCityScreen;
