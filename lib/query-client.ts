import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 phút - data còn "fresh"
      gcTime: 10 * 60 * 1000,        // 10 phút - giữ trong cache
      retry: 1,                       // Retry 1 lần nếu fail
      refetchOnWindowFocus: false,   // Không refetch khi focus window
    },
  },
});