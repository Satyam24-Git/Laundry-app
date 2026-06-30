import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

function resolveBaseUrl(): string {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL;
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  let host = '10.0.2.2'; // Default for Android emulator
  if (Platform.OS === 'web') {
    host = window.location.hostname;
  } else if (Constants.expoConfig?.hostUri) {
    host = Constants.expoConfig.hostUri.split(':')[0];
  }

  return `http://${host}:8000/api/v1`;
}

const BASE_URL = resolveBaseUrl();

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors if needed for Auth tokens later
