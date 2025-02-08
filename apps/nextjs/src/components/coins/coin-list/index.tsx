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
      staleTime: 30 * 1000, // Данные считаются свежими 30 секунд
      gcTime: 5 * 60 * 1000, // Хранить неиспользуемые данные 5 минут
      refetchInterval: 30 * 1000, // Обновлять каждые 30 секунд
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  );

  // Предварительная загрузка следующей и предыдущей страницы
  const prefetchAdjacentPages = useCallback(() => {
  // Следующая страница
    if (page < MAX_PAGES) {
      void utils.coin.getTop100Coins.prefetch({
        page: page + 1,
        perPage: ITEMS_PER_PAGE,
      });
    }
    // Предыдущая страница
    if (page > 1) {
      void utils.coin.getTop100Coins.prefetch({
        page: page - 1,
        perPage: ITEMS_PER_PAGE,
      });
    }
  }, [page, utils]);

  useEffect(() => {
    prefetchAdjacentPages();
    return () => {
      void utils.coin.getTop100Coins.reset();
    };
  }, [prefetchAdjacentPages, utils]);

  const totalPages = useMemo(
    () => (data ? Math.ceil(data.totalCoins / ITEMS_PER_PAGE) : 0),
    [data],
  );

  if (isLoading && !data) { // Показываем скелетон только если нет данных
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
          onPageChange={handlePageChange}
        />
      </div>
    </Container>
  );
}