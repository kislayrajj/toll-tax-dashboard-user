// Filename: src/hooks/useSubmit.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/apiService';

/**
 * A custom hook for submitting data (POST, PATCH, DELETE) using React Query.
 */
export const useSubmit = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    // The mutation function can call any of our apiService methods
    mutationFn: ({ endpoint, method = 'post', body }) => {
      const apiMethod = apiService[method.toLowerCase()];
      if (!apiMethod) {
        throw new Error(`Invalid API method: ${method}`);
      }
      return apiMethod(endpoint, body);
    },
    // Optional: After a successful mutation, you might want to refetch some data.
    onSuccess: () => {
      // For example, refetch all transactions after submitting a report
      // queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  return mutation;
};