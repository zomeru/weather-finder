import React from 'react';
import { render } from '@testing-library/react-native';
import { WeatherDisplay } from '../src/components';
import { mockWeatherData, mockForecastData } from '../src/testUtils';
import { WeatherDisplayProps } from '../src/components/WeatherDisplay';

describe('WeatherDisplay Component', () => {
  const defaultProps: WeatherDisplayProps = {
    weather: mockWeatherData,
    forecast: mockForecastData,
    isFavorite: false,
    onToggleFavorite: jest.fn(),
    tempUnit: 'celsius' as const
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders weather information correctly', () => {
    const { getByTestId } = render(<WeatherDisplay {...defaultProps} />);

    expect(getByTestId('location')).toHaveTextContent('London, GB');
    expect(getByTestId('temperature')).toHaveTextContent('20°C');
    expect(getByTestId('weather-description')).toHaveTextContent('clear sky');
    expect(getByTestId('humidity-value')).toHaveTextContent('70%');
    expect(getByTestId('wind-value')).toHaveTextContent('5 m/s');
    expect(getByTestId('weather-icon')).toBeTruthy();
  });

  it('converts temperature units correctly', () => {
    const { getByTestId } = render(
      <WeatherDisplay {...defaultProps} tempUnit='fahrenheit' />
    );

    expect(getByTestId('temperature')).toHaveTextContent('68°F');
    expect(getByTestId('feels-like-value')).toHaveTextContent('72°');
  });

  it('displays forecast information correctly', () => {
    const { getAllByTestId } = render(<WeatherDisplay {...defaultProps} />);

    const forecastItems = getAllByTestId(/forecast-item-/);
    expect(forecastItems).toHaveLength(1);

    forecastItems.forEach((item, index) => {
      const dayData = mockForecastData.list[index];
      const date = new Date(dayData.dt_txt);
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      };
      const formattedDate = date.toLocaleDateString('en-US', options);

      expect(item).toHaveTextContent(
        `${formattedDate}󰖙${dayData.main.temp}°${dayData.weather[0].main}H:${dayData.main.temp_max}°L:${dayData.main.temp_min}°`
      );
    });
  });
});
