import '@testing-library/jest-native/extend-expect';

// Mock implementations
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
}));

jest.mock('./src/services', () => ({
  fetchWeather: jest.fn(),
  fetchForecast: jest.fn()
}));

jest.mock('./src/lib/storage.ts', () => ({
  saveTempUnit: jest.fn(),
  loadTempUnit: jest.fn(),
  saveWeatherData: jest.fn(),
  loadOfflineWeatherData: jest.fn(),
  updateFavorites: jest.fn(),
  loadFavorites: jest.fn(),
  removeFavorite: jest.fn(),
  loadOfflineDataByCity: jest.fn(),
  saveOfflineDataByCity: jest.fn()
}));

// Mock the Font module
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true), // Always return true for loaded fonts
  unloadAsync: jest.fn(),
  loadedNativeFonts: [] // Mock as an empty array
}));
