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

export function CoinList() {
  const { page, handlePageChange } = usePagination();
  const utils = api.useUtils();

  const { data, isLoading, isError, error, isFetching } = api.coin.getTop100Coins.useQuery(
    {
      page: 1,
      perPage: 100,
    },
    {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchInterval: 5 * 60 * 1000,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      trpc: {
        context: {
          skipBatch: true,
        },
      },
    },
  );

  const paginatedCoins = useMemo(() => {
    if (!data?.coins) return [];
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return data.coins.slice(startIndex, endIndex);
  }, [data?.coins, page]);

  const handlePageChangeWithoutPrefetch = useCallback(
    (newPage: number) => {
      handlePageChange(newPage);
    },
    [handlePageChange],
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

  if (isLoading) {
    return <SkeletonCoinList />;
  }

  if (isError || !data) {
    return (
      <ErrorMessage
        title="Failed to load coins"
        message={
          error?.message ??
          "There was an error loading the cryptocurrency list. Please try again later."
        }
      />
    );
  }

  return (
    <Container size="large" className="space-y-6">
      {isFetching && (
        <div className="text-sm text-muted-foreground">
          Updating coin data...
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 duration-1000 animate-in fade-in slide-in-from-bottom-8 fill-mode-both">
        {paginatedCoins.map((coin, index) => (
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
          onPageChange={handlePageChangeWithoutPrefetch}
        />
      </div>
    </Container>
  );
}