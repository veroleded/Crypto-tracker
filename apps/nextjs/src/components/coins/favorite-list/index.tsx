"use client";

import { useEffect } from "react";



import { Container } from "~/components/layout/container";
import { ErrorMessage } from "~/components/ui/error-message";
import { api } from "~/trpc/react";
import { SkeletonCoinList } from "../skeleton-coin-list";
import { FavoriteItem } from "./favorite-item";


export function FavoriteList() {
  const utils = api.useUtils();

  const { data: favoritesData, isLoading: isLoadingFavorites } =
    api.favorite.getAll.useQuery(undefined, {
      refetchInterval: 30000,
      staleTime: 20000,
      gcTime: 1000 * 60 * 5,
    });

  const ids = favoritesData?.favorites.map((v) => v.coinId) ?? [];

  const {
    data: coinsData,
    isLoading: isLoadingCoins,
    error,
  } = api.coin.getByIds.useQuery(
    { ids },
    {
      enabled: ids.length > 0,
      placeholderData: (prev) => prev,
      refetchInterval: 30000,
      staleTime: 20000,
      gcTime: 1000 * 60 * 5,
    },
  );

  useEffect(() => {
    return () => {
      void utils.favorite.getAll.reset();
      void utils.coin.getByIds.reset();
    };
  }, [utils]);

  if (isLoadingFavorites || (isLoadingCoins && !coinsData)) {
    return <SkeletonCoinList />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load favorites"
        message="There was an error loading your favorite coins. Please try again later."
      />
    );
  }

  if (!ids.length) {
    return (
      <Container size="small">
        <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground duration-1000 animate-in fade-in slide-in-from-bottom-4">
          <p className="text-lg font-medium">No favorite coins yet</p>
          <p className="mt-2">
            Add coins to your favorites to track them more easily
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container size="large" className="space-y-6">
      <div className="grid grid-cols-1 gap-4 duration-1000 animate-in fade-in slide-in-from-bottom-8 fill-mode-both">
        {coinsData?.coins.map((coin, index) => (
          <div
            key={coin.id}
            className="duration-1000 animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <FavoriteItem coin={coin} />
          </div>
        ))}
      </div>
    </Container>
  );
}