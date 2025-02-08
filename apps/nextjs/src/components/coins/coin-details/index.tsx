"use client";

import { useMemo } from "react";

import type { CoinDetails as CoinDetailsType } from "@acme/api";

import { ProfitCalculator } from "~/components/profit-calculator/profit-calculator";
import { CoinDescription } from "./coin-description";
import { CoinHeader } from "./coin-header";
import { CoinLinks } from "./coin-links";
import { CoinPrice } from "./coin-price";
import { CoinStats } from "./coin-stats";

interface Props {
  coin: CoinDetailsType;
}

export function CoinDetails({ coin }: Props) {
  const sections = useMemo(
    () => [
      { id: "price", Component: CoinPrice },
      { id: "stats", Component: CoinStats },
      {
        id: "calculator",
        Component: () => (
          <ProfitCalculator
            coinId={coin.id}
            currentPrice={coin.market_data.current_price.usd}
            coinName={coin.name}
          />
        ),
      },
      { id: "description", Component: CoinDescription },
      { id: "links", Component: CoinLinks },
    ],
    [coin.id, coin.market_data.current_price.usd, coin.name],
  );

  return (
    <div className="space-y-8">
      <CoinHeader coin={coin} />
      <div className="grid grid-cols-1 gap-6 duration-1000 animate-in fade-in slide-in-from-bottom-4 fill-mode-both">
        {sections.map(({ id, Component }) => (
          <Component key={id} coin={coin} />
        ))}
      </div>
    </div>
  );
}
