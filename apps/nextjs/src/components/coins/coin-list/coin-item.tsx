"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

import type { Coin } from "@acme/api";
import { Card } from "@acme/ui/card";

import { FavoriteButton } from "../favorite-button";

interface Props {
  coin: Coin;
  onRemoveFromFavorites?: () => void;
}

export function CoinItem({ coin, onRemoveFromFavorites }: Props) {
  return (
    <Card className="overflow-hidden">
      <Link
        href={`/coins/${coin.id}`}
        className="relative flex items-center gap-3 p-4"
      >
        {/* Изображение и основная информация */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative h-8 w-8 shrink-0">
            <Image
              src={coin.image}
              alt={coin.name}
              className="object-contain"
              fill
              sizes="32px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <div className="line-clamp-1 font-medium">{coin.name}</div>
              <div className="text-sm text-muted-foreground">
                {coin.symbol.toUpperCase()}
              </div>
            </div>
            <div
              className={clsx(
                "text-sm",
                coin.price_change_percentage_24h > 0
                  ? "text-green-500"
                  : "text-red-500",
              )}
            >
              {coin.price_change_percentage_24h > 0 ? "+" : ""}
              {coin.price_change_percentage_24h.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Цена и кнопка избранного */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-medium">
              ${coin.current_price.toLocaleString()}
            </div>
          </div>
          <FavoriteButton coinId={coin.id} onRemove={onRemoveFromFavorites} />
        </div>
      </Link>
    </Card>
  );
}
