"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

import { Skeleton } from "@acme/ui/skeleton";

interface Coin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

export function CoinList() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCoins() {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false",
        );
        const data = (await response.json()) as Coin[];
        setCoins(data);
      } catch (error) {
        console.error("Error fetching coins:", error);
      } finally {
        setLoading(false);
      }
    }

    void fetchCoins();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
            <div className="space-y-2 text-right">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {coins.map((coin) => (
        <Link
          href={`/coins/${coin.id}`}
          key={coin.id}
          className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
        >
          <div className="flex items-center gap-3">
            <Image
              src={coin.image}
              alt={coin.name}
              className="h-8 w-8"
              width={32}
              height={32}
            />
            <div>
              <div className="line-clamp-1 font-medium">{coin.name}</div>
              <div className="text-sm text-muted-foreground">
                {coin.symbol.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="font-medium">
              ${coin.current_price.toLocaleString()}
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
        </Link>
      ))}
    </div>
  );
}