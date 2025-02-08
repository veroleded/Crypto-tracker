"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import type { RouterOutputs } from "@acme/api";

import { api } from "~/trpc/react";
import { SkeletonCoinList } from "../skeleton-coin-list";
import { CoinItem } from "./coin-item";
import { Pagination } from "./pagination";


interface Props {
  initialData: RouterOutputs["coin"]["getTop100Coins"];
  currentPage: number;
  itemsPerPage: number;
}

export function CoinListClient({
  initialData,
  currentPage,
  itemsPerPage,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const utils = api.useUtils();

  const { data, isLoading, isError } = api.coin.getTop100Coins.useQuery(
    {
      page: currentPage,
      perPage: itemsPerPage,
    },
    {
      initialData,
      staleTime: 2 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchInterval: 2 * 60 * 1000,
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    },
  );


  useEffect(() => {
    if (currentPage < 10) {
      void utils.coin.getTop100Coins.prefetch(
        {
          page: currentPage + 1,
          perPage: itemsPerPage,
        },
        {
          staleTime: 2 * 60 * 1000,
        },
      );
    }
  }, [currentPage, itemsPerPage, utils]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

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

  const totalPages = Math.ceil(data.totalCoins / itemsPerPage);

  return (
    <div className="mx-auto w-full max-w-[1920px] space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4">
        {data.coins.map((coin) => (
          <CoinItem key={coin.id} coin={coin} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}