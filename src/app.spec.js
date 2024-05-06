import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';


const mockWeatherData = {
  weather: [{ description: 'Clear sky' }],
};

beforeAll(() => {
  
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockWeatherData),
  });
});

afterAll(() => {
 
  global.fetch.mockRestore();
});

test('renders weather information', async () => {
  render(<App />);

 
  await waitFor(() => expect(screen.getByText(/The current weather is/i)).toBeInTheDocument());
  expect(screen.getByText(/Clear sky/i)).toBeInTheDocument();
});

test('fetches weather data from API', async () => {
  render(<App />);


  await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('api.openweathermap.org'));
});

test('displays loading indicator while fetching weather data', async () => {
  render(<App />);

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
});

test('handles API fetch error', async () => {
  global.fetch.mockResolvedValueOnce({ ok: false });

  render(<App />);

  await waitFor(() => expect(screen.getByText(/Failed to fetch weather data/i)).toBeInTheDocument());
});