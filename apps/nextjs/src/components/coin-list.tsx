"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";

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
      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          <div className="flex items-center gap-4">
            <Image
              src={coin.image}
              alt={coin.name}
              className="h-8 w-8"
              width={32}
              height={32}
            />
            <div>
              <div className="font-medium">{coin.name}</div>
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
              {coin.price_change_percentage_24h.toFixed(2)}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}