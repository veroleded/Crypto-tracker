"use client";

import Image from "next/image";

import { api } from "~/trpc/react";
import { CoinDescription } from "./coin-description";
import { CoinLinks } from "./coin-links";
import { CoinStats } from "./coin-stats";
import { SkeletonCoinDetails } from "./skeleton";

interface Props {
  coinId: string;
}

export function CoinDetails({ coinId }: Props) {
  const {
    data: coin,
    isLoading,
    isError,
  } = api.coin.getDetailsById.useQuery(coinId);

  if (isLoading) {
    return <SkeletonCoinDetails />;
  }

  if (isError || !coin) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        Failed to load coin details
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <div className="flex items-center gap-4">
        <Image
          src={coin.image.large}
          alt={coin.name}
          className="h-16 w-16 rounded-full"
          width={64}
          height={64}
          priority
        />
        <div>
          <h1 className="text-3xl font-bold">
            {coin.name} ({coin.symbol.toUpperCase()})
          </h1>
          <p className="text-xl font-medium">
            ${coin.market_data.current_price.usd.toLocaleString()}
          </p>
        </div>
      </div>

      <CoinStats coin={coin} />
      <CoinDescription coin={coin} />
      <CoinLinks coin={coin} />
    </div>
  );
}
