import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export interface WeatherData {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  dt: number;
}

export interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
      deg: number;
    };
    dt_txt: string;
  }>;
  city: {
    id: number;
    name: string;
    country: string;
  };
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type Theme = 'light' | 'dark';

export interface WeatherState {
  theme: Theme;
  favorites: string[];
  tempUnit: TemperatureUnit;
  offlineData: Record<
    string,
    {
      weather: WeatherData;
      forecast: ForecastData;
    }
  >;
}

export type WeatherAction =
  | { type: 'ADD_FAVORITE'; city: string }
  | { type: 'REMOVE_FAVORITE'; city: string }
  | { type: 'TOGGLE_THEME'; theme: Theme }
  | { type: 'TOGGLE_TEMP_UNIT'; tempUnit: TemperatureUnit }
  | {
      type: 'SET_OFFLINE_DATA';
      data: WeatherState['offlineData'];
    };

export interface WeatherContextType {
  state: WeatherState;
  dispatch: React.Dispatch<WeatherAction>;
}

export type RootStackParamList = {
  Home: undefined;
  Favorites: undefined;
  FavoriteCity: { city: string };
};

export type ScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  keyof RootStackParamList
>;
