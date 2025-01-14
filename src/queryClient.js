// src/queryClient.js

import { QueryClient } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Define default behavior for queries
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      retry: 2, // Retry failed requests twice
      refetchOnWindowFocus: false, // Disable refetch on window focus
    },
  },
});

export default queryClient;
