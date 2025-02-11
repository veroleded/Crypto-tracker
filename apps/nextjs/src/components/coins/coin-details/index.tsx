"use client";

import type { CoinDetails as CoinDetailsType } from "@acme/api";
import { Separator } from "@acme/ui/separator";
import { useMemo } from "react";

import { ProfitCalculator } from "~/components/profit-calculator/profit-calculator";
import { CoinAIAnalysis } from "./coin-ai-analysis";
import { CoinDescription } from "./coin-description";
import { CoinHeader } from "./coin-header";
import { CoinLinks } from "./coin-links";
import { CoinPrice } from "./coin-price";
import { CoinPriceChart } from "./coin-price-chart";
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CoinHeader coin={coin} />
        <CoinAIAnalysis coinId={coin.id} />
      </div>
      <Separator />
      <CoinPriceChart coinId={coin.id} />
      <div className="grid grid-cols-1 gap-6 duration-1000 animate-in fade-in slide-in-from-bottom-4 fill-mode-both">
        {sections.map(({ id, Component }) => (
          <Component key={id} coin={coin} />
        ))}
      </div>
    </div>
  );
}
