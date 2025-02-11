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

  const { data: isFavorite, isLoading: isCheckingStatus } = api.favorite.isFavorite.useQuery(
    { coinId },
    {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchInterval: 2 * 60 * 1000,
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    }
  );

  const handleMutationStart = useCallback(async () => {
    await utils.favorite.isFavorite.cancel({ coinId });
    await utils.coin.getByIds.cancel();

    const prevData = utils.favorite.isFavorite.getData({ coinId });

    return { prevData };
  }, [utils, coinId]);

  const handleMutationError = useCallback(
    (context: { prevData: boolean | undefined; }) => {
      if (context.prevData !== undefined) {
        utils.favorite.isFavorite.setData({ coinId }, context.prevData);
      }
    },
    [utils, coinId],
  );

  const handleMutationSettled = useCallback(() => {
    void utils.favorite.isFavorite.invalidate({ coinId });
    void utils.coin.getByIds.invalidate();
  }, [utils, coinId]);

  const addMutation = api.favorite.add.useMutation({
    onMutate: async () => {
      const prevData = await handleMutationStart();
      utils.favorite.isFavorite.setData({ coinId }, true);
      return prevData;
    },
    onError: (_, __, context) => handleMutationError(context ?? { prevData: undefined }),
    onSettled: handleMutationSettled,
  });

  const removeMutation = api.favorite.remove.useMutation({
    onMutate: async () => {
      const prevData = await handleMutationStart();
      utils.favorite.isFavorite.setData({ coinId }, false);
      onRemove?.();
      return prevData;
    },
    onError: (_, __, context) => handleMutationError(context ?? { prevData: undefined }),
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
    if (isLoading || isCheckingStatus) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }

    return (
      <Heart
        className={`h-4 w-4 ${isFavorite ? "fill-current text-red-500" : ""}`}
      />
    );
  }, [isLoading, isCheckingStatus, isFavorite]);

  const buttonLabel = useMemo(
    () => (isFavorite ? "Remove from favorites" : "Add to favorites"),
    [isFavorite],
  );

  if (isCheckingStatus) {
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