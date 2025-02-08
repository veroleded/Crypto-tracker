"use client";

import { useCallback, useEffect, useMemo } from "react";

import { Container } from "~/components/layout/container";
import { ErrorMessage } from "~/components/ui/error-message";
import { usePagination } from "~/hooks/use-pagination";
import { api } from "~/trpc/react";
import { SkeletonCoinList } from "../skeleton-coin-list";
import { CoinItem } from "./coin-item";
import { Pagination } from "./pagination";

const ITEMS_PER_PAGE = 10;
const MAX_PAGES = 10;

export function CoinList() {
  const { page, handlePageChange } = usePagination();
  const utils = api.useUtils();

  const { data, isLoading, isError } = api.coin.getTop100Coins.useQuery(
    {
      page,
      perPage: ITEMS_PER_PAGE,
    },
    {
      staleTime: 2 * 60 * 1000, // Данные считаются свежими 2 минуты
      gcTime: 10 * 60 * 1000, // Хранить неиспользуемые данные 10 минут
      refetchInterval: 2 * 60 * 1000, // Обновлять каждые 2 минуты
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    },
  );

  // Предзагрузка только при явном переходе на страницу
  const prefetchNextPage = useCallback(
    (nextPage: number) => {
      if (nextPage >= 1 && nextPage <= MAX_PAGES) {
        void utils.coin.getTop100Coins.prefetch(
          {
            page: nextPage,
            perPage: ITEMS_PER_PAGE,
          },
          {
            staleTime: 2 * 60 * 1000,
          },
        );
      }
    },
    [utils],
  );

  // Обработчик изменения страницы с предзагрузкой
  const handlePageChangeWithPrefetch = useCallback(
    (newPage: number) => {
      handlePageChange(newPage);
      // Предзагружаем следующую страницу только после явного перехода
      prefetchNextPage(newPage + 1);
    },
    [handlePageChange, prefetchNextPage],
  );

  useEffect(() => {
    return () => {
      void utils.coin.getTop100Coins.reset();
    };
  }, [utils]);

  const totalPages = useMemo(
    () => (data ? Math.ceil(data.totalCoins / ITEMS_PER_PAGE) : 0),
    [data],
  );

  if (isLoading && !data) {
    return <SkeletonCoinList />;
  }

  if (isError || !data) {
    return (
      <ErrorMessage
        title="Failed to load coins"
        message="There was an error loading the cryptocurrency list. Please try again later."
      />
    );
  }

  return (
    <Container size="large" className="space-y-6">
      <div className="grid grid-cols-1 gap-4 duration-1000 animate-in fade-in slide-in-from-bottom-8 fill-mode-both">
        {data.coins.map((coin, index) => (
          <div
            key={coin.id}
            className="duration-1000 animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CoinItem coin={coin} />
          </div>
        ))}
      </div>

      <div className="duration-1000 animate-in fade-in slide-in-from-bottom-4">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChangeWithPrefetch}
        />
      </div>
    </Container>
  );
}