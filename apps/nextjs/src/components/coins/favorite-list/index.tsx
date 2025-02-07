"use client";

import { useEffect } from "react";



import { Container } from "~/components/layout/container";
import { api } from "~/trpc/react";
import { SkeletonCoinList } from "../skeleton-coin-list";
import { FavoriteItem } from "./favorite-item";

export function FavoriteList() {
  const utils = api.useUtils();

  const { data: favoritesData, isLoading: isLoadingFavorites } =
    api.favorite.getAll.useQuery(undefined, {
      staleTime: 0,
      refetchInterval: 1000,
    });

  const ids = favoritesData?.favorites.map((v) => v.coinId) ?? [];

  const { data: coinsData, isLoading: isLoadingCoins } =
    api.coin.getByIds.useQuery(
      { ids },
      {
        enabled: ids.length > 0,
        staleTime: 0,
        placeholderData: (prev) => prev,
      },
    );

  // Очищаем кэш при размонтировании
  useEffect(() => {
    return () => {
      void utils.coin.getTop100Coins.reset();
    };
  }, [utils]);

  // Показываем скелетон только при первой загрузке
  if (isLoadingFavorites || (isLoadingCoins && !coinsData)) {
    return <SkeletonCoinList />;
  }

  if (!ids.length) {
    return (
      <Container>
        <div className="text-center text-muted-foreground">
          You haven't added any coins to favorites yet
        </div>
      </Container>
    );
  }

  return (
    <Container className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {coinsData?.coins.map((coin) => (
          <FavoriteItem key={coin.id} coin={coin} />
        ))}
      </div>
    </Container>
  );
}