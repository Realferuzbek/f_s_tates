import { useCallback } from 'react';
import apiClient from '../utils/apiClient.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function useAnalytics() {
  const { token } = useAuth();

  return useCallback(
    (eventType, { screen, properties } = {}) => {
      if (typeof window === 'undefined') {
        return;
      }
      const authToken = typeof token === 'function' ? token() : null;
      const headers = authToken
        ? {
            Authorization: `Bearer ${authToken}`
          }
        : undefined;
      apiClient
        .post(
          '/track',
          {
            eventType,
            screen,
            properties
          },
          { headers }
        )
        .catch(() => {});
    },
    [token]
  );
}
