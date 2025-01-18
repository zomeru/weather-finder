import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAppColorScheme } from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, WeatherAction, WeatherState } from '../types';
import tw from '../lib/tailwind';
import {
  loadFavorites,
  loadOfflineWeatherData,
  loadTempUnit
} from '../lib/storage';

const initialState: WeatherState = {
  favorites: [],
  tempUnit: 'celsius',
  offlineData: {},
  theme: 'light'
};

const WeatherContext = createContext<{
  state: WeatherState;
  dispatch: React.Dispatch<WeatherAction>;
}>({ state: initialState, dispatch: () => null });

export const useWeather = () => useContext(WeatherContext);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [_colorScheme, _toggleColorScheme, setColorScheme] =
    useAppColorScheme(tw);

  const [state, dispatch] = useReducer(
    (state: WeatherState, action: WeatherAction): WeatherState => {
      switch (action.type) {
        case 'ADD_FAVORITE':
          return {
            ...state,
            favorites: [
              action.city,
              ...state.favorites.filter(city => city !== action.city)
            ]
          };
        case 'REMOVE_FAVORITE':
          return {
            ...state,
            favorites: state.favorites.filter(city => city !== action.city)
          };
        case 'TOGGLE_TEMP_UNIT':
          return {
            ...state,
            tempUnit: action.tempUnit
          };
        case 'TOGGLE_THEME':
          return {
            ...state,
            theme: action.theme
          };
        case 'SET_OFFLINE_DATA':
          return {
            ...state,
            offlineData: action.data
          };
        default:
          return state;
      }
    },
    initialState
  );

  useEffect(() => {
    loadTempUnit().then(tempUnit => {
      if (tempUnit) {
        dispatch({ type: 'TOGGLE_TEMP_UNIT', tempUnit });
      }
    });

    loadOfflineWeatherData().then(data => {
      if (data && Object.keys(data).length) {
        dispatch({ type: 'SET_OFFLINE_DATA', data });
      }
    });

    loadFavorites().then(favorites => {
      if (favorites && favorites.length) {
        favorites.forEach(city => {
          dispatch({ type: 'ADD_FAVORITE', city });
        });
      }
    });

    (async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          dispatch({ type: 'TOGGLE_THEME', theme: savedTheme as Theme });
          setColorScheme(savedTheme as Theme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    })();
  }, []);

  return (
    <WeatherContext.Provider value={{ state, dispatch }}>
      {children}
    </WeatherContext.Provider>
  );
};
