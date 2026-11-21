import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Polling berhenti saat tab tidak aktif dan refetch saat kembali fokus (PRD 12.3).
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: true,
      retry: 1,
      staleTime: 2_000,
    },
  },
});
