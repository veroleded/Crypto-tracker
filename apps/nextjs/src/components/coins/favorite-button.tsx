"use client";

import { Heart, Loader2 } from "lucide-react";
import { useCallback, useMemo } from "react";

import { Button } from "@acme/ui/button";

import { api } from "~/trpc/react";

interface FavoriteButtonProps {
  coinId: string;
  onRemove?: () => void;
}

export function FavoriteButton({ coinId, onRemove }: FavoriteButtonProps) {
  const utils = api.useUtils();

  const { data: favoritesData } = api.favorite.getAll.useQuery(undefined, {
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const isFavorite = useMemo(() => {
    if (!favoritesData) return false;
    return favoritesData.favorites.some((f) => f.coinId === coinId);
  }, [favoritesData, coinId]);

  const handleMutationStart = useCallback(async () => {
    await utils.favorite.getAll.cancel();
    await utils.coin.getByIds.cancel();

    const prevData = {
      favorites: utils.favorite.getAll.getData() ?? { favorites: [] },
    };

    return prevData;
  }, [utils]);

  const handleMutationError = useCallback(
    (
      context: { favorites: { favorites: { coinId: string; }[]; }; } | undefined,
    ) => {
      if (context) {
        utils.favorite.getAll.setData(undefined, context.favorites);
      }
    },
    [utils],
  );

  const handleMutationSettled = useCallback(() => {
    void utils.favorite.getAll.invalidate();
    void utils.coin.getByIds.invalidate();
  }, [utils]);

  const addMutation = api.favorite.add.useMutation({
    onMutate: async () => {
      const prevData = await handleMutationStart();
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

  if (!favoritesData) {
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