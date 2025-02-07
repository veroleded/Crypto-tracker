"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { api } from "~/trpc/react";
import { CoinItem } from "./coin-item";
import { Pagination } from "./pagination";
import { SkeletonCoinList } from "./skeleton-coin-list";

const ITEMS_PER_PAGE = 10;

export function CoinList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const { data, isLoading, isError } = api.coin.getTop100Coins.useQuery({
    page,
    perPage: ITEMS_PER_PAGE,
  });

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (isLoading) {
    return <SkeletonCoinList currentPage={page} />;
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
    <div className="mx-auto w-full max-w-[1920px] space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4">
        {data.coins.map((coin) => (
          <CoinItem key={coin.id} coin={coin} />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}