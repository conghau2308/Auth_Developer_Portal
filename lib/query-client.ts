import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 phút - data còn "fresh"
      gcTime: 10 * 60 * 1000,        // 10 phút - giữ trong cache
      retry: (failureCount, error: any) => {
        // Không retry khi bị rate limit — server đã yêu cầu dừng gửi request
        if (error?.response?.status === 429) return false;
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,   // Không refetch khi focus window
    },
  },
});