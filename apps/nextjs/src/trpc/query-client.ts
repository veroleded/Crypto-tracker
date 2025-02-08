import { QueryClient } from "@tanstack/react-query";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5000, // 5 секунд
        gcTime: 0,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
