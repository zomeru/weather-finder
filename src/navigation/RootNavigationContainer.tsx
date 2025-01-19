import React from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon } from '@rneui/themed';
import { FavoriteCityScreen, FavoritesScreen, HomeScreen } from '../screens';
import tw from '../lib/tailwind';
import { useWeather } from '../context';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { state } = useWeather();

  return (
    <SafeAreaProvider>
      <StatusBar style={state.theme === 'dark' ? 'light' : 'dark'} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='Home'
          screenOptions={({ navigation }) => ({
            headerStyle: {
              backgroundColor: state.theme === 'dark' ? '#111827' : '#FFFFFF'
            },
            headerShadowVisible: false,
            headerTitleStyle: {
              color: state.theme === 'dark' ? '#FFFFFF' : '#111827'
            },
            headerTitleAlign: 'center',
            headerLeft: ({ canGoBack }) =>
              canGoBack ? (
                <Icon
                  name={
                    Platform.select({
                      ios: 'chevron-back',
                      android: 'arrow-back'
                    }) || 'arrow-back'
                  }
                  type='ionicon'
                  size={24}
                  color={state.theme === 'dark' ? '#FFFFFF' : '#111827'}
                  onPress={() => navigation.goBack()}
                  containerStyle={tw`ml-2`}
                />
              ) : null,
            headerBackVisible: false // Hide default back button
          })}
        >
          <Stack.Screen name='Home' component={HomeScreen} />
          <Stack.Screen name='Favorites' component={FavoritesScreen} />
          <Stack.Screen name='FavoriteCity' component={FavoriteCityScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNavigator;
