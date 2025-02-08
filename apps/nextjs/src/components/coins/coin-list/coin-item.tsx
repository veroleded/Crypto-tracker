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
  const priceChangeIsPositive = coin.price_change_percentage_24h > 0;
  const formattedPriceChange = `${priceChangeIsPositive ? "+" : ""}${coin.price_change_percentage_24h.toFixed(2)}%`;

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:bg-accent/5 hover:shadow-lg">
      <Link
        href={`/coins/${coin.id}`}
        className="relative flex items-center gap-3 p-4"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative h-8 w-8 shrink-0 transition-transform duration-200 group-hover:scale-110">
            <Image
              src={coin.image}
              alt={coin.name}
              className="object-contain"
              fill
              sizes="32px"
              priority={false}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <div className="line-clamp-1 font-medium transition-colors duration-200 hover:text-primary">
                {coin.name}
              </div>
              <div className="text-sm text-muted-foreground transition-colors duration-200">
                {coin.symbol.toUpperCase()}
              </div>
            </div>
            <div
              className={clsx(
                "text-sm transition-colors duration-200",
                priceChangeIsPositive
                  ? "text-green-500 dark:text-green-400"
                  : "text-red-500 dark:text-red-400",
              )}
            >
              {formattedPriceChange}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-medium transition-colors duration-200 hover:text-primary">
              ${coin.current_price.toLocaleString()}
            </div>
          </div>
          <FavoriteButton coinId={coin.id} onRemove={onRemoveFromFavorites} />
        </div>
      </Link>
    </Card>
  );
}
