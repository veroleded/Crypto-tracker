"use client";



import type { CoinDetails as CoinDetailsType } from "@acme/api";
import { CoinDescription } from "./coin-description";
import { CoinHeader } from "./coin-header";
import { CoinLinks } from "./coin-links";
import { CoinPrice } from "./coin-price";
import { CoinStats } from "./coin-stats";

interface Props {
  coin: CoinDetailsType;
}

export function CoinDetails({ coin }: Props) {
  return (
    <>
      <CoinHeader coin={coin} />
      <div className="grid grid-cols-1 gap-6">
        <CoinPrice coin={coin} />
        <CoinStats coin={coin} />
        <CoinDescription coin={coin} />
        <CoinLinks coin={coin} />
      </div>
    </>
  );
}