"use client";

import { useRouter } from "next/navigation";

import type { Coin } from "@acme/api";

import { api } from "~/trpc/react";
import { CoinItem } from "../coin-list/coin-item";

interface Props {
  coin: Coin;
}

export function FavoriteItem({ coin }: Props) {
  const router = useRouter();
  const utils = api.useUtils();

  const removeMutation = api.favorite.remove.useMutation({
    onSuccess: () => {
      void utils.favorite.getAll.invalidate();
      router.refresh();
    },
  });

  return (
    <CoinItem
      key={coin.id}
      coin={coin}
      onRemoveFromFavorites={() => {
        removeMutation.mutate({ coinId: coin.id });
      }}
    />
  );
}
