import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

    } catch (error) {
      console.log('Error getting token:', error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);


import { resetToAuth } from '../navigation/NavigationService';

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log('Unauthorized - Logging out');

      await AsyncStorage.removeItem('userToken');

      // Navigate to login screen via Auth stack reset
      resetToAuth();
    }

    return Promise.reject(error);
  }
);


export default api;