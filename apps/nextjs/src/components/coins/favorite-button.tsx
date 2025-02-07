"use client";

import { Heart } from "lucide-react";

import { Button } from "@acme/ui/button";

import { api } from "~/trpc/react";

interface FavoriteButtonProps {
  coinId: string;
  className?: string;
}

export function FavoriteButton({ coinId, className }: FavoriteButtonProps) {
  const utils = api.useUtils();

  const { data: isFavorite } = api.favorite.isFavorite.useQuery({ coinId });

  const addMutation = api.favorite.add.useMutation({
    onSuccess: () => {
      void utils.favorite.isFavorite.invalidate({ coinId });
      void utils.favorite.getAll.invalidate();
    },
  });

  const removeMutation = api.favorite.remove.useMutation({
    onSuccess: () => {
      void utils.favorite.isFavorite.invalidate({ coinId });
      void utils.favorite.getAll.invalidate();
    },
  });

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeMutation.mutate({ coinId });
    } else {
      addMutation.mutate({ coinId });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={handleToggleFavorite}
    >
      <Heart
        className={`h-5 w-5 ${isFavorite ? "fill-current text-red-500" : ""}`}
      />
    </Button>
  );
} 