// src/queryClient.js

import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry failed requests 1 time
      retry: 1,
      // Refetch on window focus
      refetchOnWindowFocus: true,
      // Stale time (in milliseconds)
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      // You can set global mutation options here
    },
  },
});

export default queryClient;
