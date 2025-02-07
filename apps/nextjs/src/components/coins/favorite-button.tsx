"use client";

import { Heart, Loader2 } from "lucide-react";



import { Button } from "@acme/ui/button";

import { api } from "~/trpc/react";

interface FavoriteButtonProps {
  coinId: string;
  onRemove?: () => void;
}

export function FavoriteButton({ coinId, onRemove }: FavoriteButtonProps) {
  const utils = api.useUtils();

  const { data: isFavorite, isLoading: isCheckingFavorite } =
    api.favorite.isFavorite.useQuery({ coinId });

  const addMutation = api.favorite.add.useMutation({
    onMutate: async () => {
      await Promise.all([
        utils.favorite.isFavorite.cancel({ coinId }),
        utils.favorite.getAll.cancel(),
        utils.coin.getByIds.cancel(),
      ]);

      const prevData = {
        isFavorite: utils.favorite.isFavorite.getData({ coinId }),
        favorites: utils.favorite.getAll.getData(),
      };

      utils.favorite.isFavorite.setData({ coinId }, true);
      const oldFavorites = prevData.favorites?.favorites ?? [];
      utils.favorite.getAll.setData(undefined, {
        favorites: [...oldFavorites, { coinId }],
      });

      return prevData;
    },
    onError: (_, __, context) => {
      if (context) {
        utils.favorite.isFavorite.setData({ coinId }, context.isFavorite);
        utils.favorite.getAll.setData(undefined, context.favorites);
      }
    },
    onSettled: () => {
      void utils.favorite.isFavorite.invalidate({ coinId });
      void utils.favorite.getAll.invalidate();
      void utils.coin.getByIds.invalidate();
    },
  });

  const removeMutation = api.favorite.remove.useMutation({
    onMutate: async () => {
      await Promise.all([
        utils.favorite.isFavorite.cancel({ coinId }),
        utils.favorite.getAll.cancel(),
        utils.coin.getByIds.cancel(),
      ]);

      const prevData = {
        isFavorite: utils.favorite.isFavorite.getData({ coinId }),
        favorites: utils.favorite.getAll.getData(),
      };

      utils.favorite.isFavorite.setData({ coinId }, false);
      const oldFavorites = prevData.favorites?.favorites ?? [];
      utils.favorite.getAll.setData(undefined, {
        favorites: oldFavorites.filter((f) => f.coinId !== coinId),
      });

      onRemove?.();
      return prevData;
    },
    onError: (_, __, context) => {
      if (context) {
        utils.favorite.isFavorite.setData({ coinId }, context.isFavorite);
        utils.favorite.getAll.setData(undefined, context.favorites);
      }
    },
    onSettled: () => {
      void utils.favorite.isFavorite.invalidate({ coinId });
      void utils.favorite.getAll.invalidate();
      void utils.coin.getByIds.invalidate();
    },
  });

  const isLoading = addMutation.isPending || removeMutation.isPending;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    if (isFavorite) {
      removeMutation.mutate({ coinId });
    } else {
      addMutation.mutate({ coinId });
    }
  };

  if (isCheckingFavorite) {
    return <Loader2 className="h-4 w-4 animate-spin" />;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 rounded-full"
      onClick={handleToggleFavorite}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart
          className={`h-4 w-4 ${isFavorite ? "fill-current text-red-500" : ""}`}
        />
      )}
      <span className="sr-only">
        {isFavorite ? "Remove from favorites" : "Add to favorites"}
      </span>
    </Button>
  );
}