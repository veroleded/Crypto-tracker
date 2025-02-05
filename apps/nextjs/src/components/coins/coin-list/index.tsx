"use client";

import { useState } from "react";

import { api } from "~/trpc/react";
import { CoinItem } from "./coin-item";
import { Pagination } from "./pagination";
import { SkeletonCoinList } from "./skeleton-coin-list";

const ITEMS_PER_PAGE = 10;

export function CoinList() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = api.coin.getTop100Coins.useQuery({
    page,
    perPage: ITEMS_PER_PAGE,
  });

  if (isLoading) {
    return <SkeletonCoinList />;
  }

  if (isError || !data) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        Failed to load coins
      </div>
    );
  }

  const totalPages = Math.ceil(data.totalCoins / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.coins.map((coin) => (
          <CoinItem key={coin.id} coin={coin} />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
