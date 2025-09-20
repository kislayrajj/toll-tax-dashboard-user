import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/apiService';

/**
 * A custom hook for fetching data from the API using React Query.
 * @param {string} endpoint - The API endpoint to fetch.
 * @returns The result object from React Query, containing data, loading, error, etc.
 */
export const useFetch = (endpoint) => {
  // Handle null or undefined endpoint
  const queryKey = endpoint ? endpoint.split('/').filter(Boolean) : [];

  return useQuery({
    queryKey: queryKey,
    queryFn: () => {
      // Don't make API call if endpoint is null or undefined
      if (!endpoint) {
        return Promise.resolve(null);
      }
      return apiService.get(endpoint);
    },
  });
};