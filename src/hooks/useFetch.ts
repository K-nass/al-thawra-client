import { useState, useEffect } from 'react';
import type { LoadingState } from '../types';

interface UseFetchOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

/**
 * Generic fetch hook for data fetching
 * Consider using React Query for production
 */
export const useFetch = <T,>(
  fetchFn: () => Promise<T>,
  options: UseFetchOptions<T> = {}
) => {
  const [data, setData] = useState<T | undefined>(options.initialData);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<LoadingState>('idle');

  const isLoading = status === 'loading';
  const isError = status === 'error';
  const isSuccess = status === 'success';

  const refetch = async () => {
    setStatus('loading');
    setError(null);

    try {
      const result = await fetchFn();
      setData(result);
      setStatus('success');
      options.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      setStatus('error');
      options.onError?.(error);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return {
    data,
    error,
    status,
    isLoading,
    isError,
    isSuccess,
    refetch,
  };
};
