import axios from 'axios';
import { Platform } from 'react-native';

// Note: Use your machine's IP address instead of localhost if testing on an actual physical device
const BASE_URL = Platform.OS === 'web' 
  ? 'http://localhost:8000/api/v1'
  : 'http://10.0.2.2:8000/api/v1'; // Android emulator

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors if needed for Auth tokens later
