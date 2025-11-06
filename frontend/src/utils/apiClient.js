import axios from 'axios';

const apiBaseUrl =
  typeof window !== 'undefined' && window.__APP_API_BASE_URL
    ? window.__APP_API_BASE_URL
    : import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: apiBaseUrl
});

apiClient.interceptors.request.use((config) => {
  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

export default apiClient;
