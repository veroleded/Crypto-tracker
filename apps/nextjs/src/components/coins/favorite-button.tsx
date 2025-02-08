"use client";

import { useCallback, useMemo } from "react";
import { Heart, Loader2 } from "lucide-react";

import { Button } from "@acme/ui/button";

import { api } from "~/trpc/react";

interface FavoriteButtonProps {
  coinId: string;
  onRemove?: () => void;
}

interface MutationContext {
  isFavorite: boolean;
  favorites: {
    favorites: { coinId: string }[];
  };
}

export function FavoriteButton({ coinId, onRemove }: FavoriteButtonProps) {
  const utils = api.useUtils();

  const { data: isFavorite, isLoading: isCheckingFavorite } =
    api.favorite.isFavorite.useQuery({ coinId });

  const handleMutationStart = useCallback(async () => {
    await Promise.all([
      utils.favorite.isFavorite.cancel({ coinId }),
      utils.favorite.getAll.cancel(),
      utils.coin.getByIds.cancel(),
    ]);

    const prevData = {
      isFavorite: utils.favorite.isFavorite.getData({ coinId }) ?? false,
      favorites: utils.favorite.getAll.getData() ?? { favorites: [] },
    };

    return prevData;
  }, [coinId, utils]);

  const handleMutationError = useCallback(
    (context: MutationContext | undefined) => {
      if (context) {
        utils.favorite.isFavorite.setData({ coinId }, context.isFavorite);
        utils.favorite.getAll.setData(undefined, context.favorites);
      }
    },
    [coinId, utils],
  );

  const handleMutationSettled = useCallback(() => {
    void utils.favorite.isFavorite.invalidate({ coinId });
    void utils.favorite.getAll.invalidate();
    void utils.coin.getByIds.invalidate();
  }, [coinId, utils]);

  const addMutation = api.favorite.add.useMutation({
    onMutate: async () => {
      const prevData = await handleMutationStart();
      utils.favorite.isFavorite.setData({ coinId }, true);
      utils.favorite.getAll.setData(undefined, {
        favorites: [...prevData.favorites.favorites, { coinId }],
      });
      return prevData;
    },
    onError: (_, __, context) => handleMutationError(context),
    onSettled: handleMutationSettled,
  });

  const removeMutation = api.favorite.remove.useMutation({
    onMutate: async () => {
      const prevData = await handleMutationStart();
      utils.favorite.isFavorite.setData({ coinId }, false);
      utils.favorite.getAll.setData(undefined, {
        favorites: prevData.favorites.favorites.filter(
          (f) => f.coinId !== coinId,
        ),
      });
      onRemove?.();
      return prevData;
    },
    onError: (_, __, context) => handleMutationError(context),
    onSettled: handleMutationSettled,
  });

  const isLoading = addMutation.isPending || removeMutation.isPending;

  const handleToggleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (isLoading) return;

      if (isFavorite) {
        removeMutation.mutate({ coinId });
      } else {
        addMutation.mutate({ coinId });
      }
    },
    [isLoading, isFavorite, removeMutation, addMutation, coinId],
  );

  const buttonContent = useMemo(() => {
    if (isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }

    return (
      <Heart
        className={`h-4 w-4 ${isFavorite ? "fill-current text-red-500" : ""}`}
      />
    );
  }, [isLoading, isFavorite]);

  const buttonLabel = useMemo(
    () => (isFavorite ? "Remove from favorites" : "Add to favorites"),
    [isFavorite],
  );

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
      {buttonContent}
      <span className="sr-only">{buttonLabel}</span>
    </Button>
  );
}
