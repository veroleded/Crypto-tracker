import { useMemo } from "react";

import type { CoinDetails } from "@acme/api/";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui/tabs";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: React.ReactNode;
  isPositive?: boolean;
}

function StatCard({ title, value, subtitle, isPositive }: StatCardProps) {
  const valueClassName = useMemo(() => {
    if (isPositive === undefined) return "text-gray-900 dark:text-white";
    return isPositive
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400";
  }, [isPositive]);

  return (
    <article className="overflow-hidden rounded-lg bg-white p-4 shadow dark:bg-gray-800">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </h3>
      <p className={`mt-2 truncate text-lg font-semibold ${valueClassName}`}>
        {value}
      </p>
      {subtitle && (
        <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      )}
    </article>
  );
}

interface MarketDataProps {
  coin: CoinDetails;
}

function MarketData({ coin }: MarketDataProps) {
  const marketData = useMemo(
    () => ({
      marketCap: `$${coin.market_data.market_cap.usd.toLocaleString()}`,
      marketCapRank: `Rank #${coin.market_data.market_cap_rank}`,
      volume: `$${coin.market_data.total_volume.usd.toLocaleString()}`,
      price: `$${coin.market_data.current_price.usd.toLocaleString()}`,
      high24h: coin.market_data.high_24h.usd.toLocaleString(),
      low24h: coin.market_data.low_24h.usd.toLocaleString(),
    }),
    [coin.market_data],
  );

  const priceChanges = useMemo(
    () => ({
      "24h": {
        value: coin.market_data.price_change_percentage_24h.toFixed(2),
        isPositive: coin.market_data.price_change_percentage_24h > 0,
      },
      "7d": {
        value: coin.market_data.price_change_percentage_7d.toFixed(2),
        isPositive: coin.market_data.price_change_percentage_7d > 0,
      },
      "30d": {
        value: coin.market_data.price_change_percentage_30d.toFixed(2),
        isPositive: coin.market_data.price_change_percentage_30d > 0,
      },
      "1y": {
        value: coin.market_data.price_change_percentage_1y.toFixed(2),
        isPositive: coin.market_data.price_change_percentage_1y > 0,
      },
    }),
    [coin.market_data],
  );

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Market Cap"
          value={marketData.marketCap}
          subtitle={marketData.marketCapRank}
        />
        <StatCard title="Volume (24h)" value={marketData.volume} />
        <StatCard
          title="Price"
          value={marketData.price}
          subtitle={
            <>
              <span className="inline-block">24h: {marketData.high24h} ↑</span>
              <span className="ml-2 inline-block">{marketData.low24h} ↓</span>
            </>
          }
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Object.entries(priceChanges).map(([period, data]) => (
          <StatCard
            key={period}
            title={period}
            value={`${data.value}%`}
            isPositive={data.isPositive}
          />
        ))}
      </div>
    </>
  );
}

interface SupplyDataProps {
  coin: CoinDetails;
}

function SupplyData({ coin }: SupplyDataProps) {
  const supplyData = useMemo(
    () => ({
      circulating: coin.market_data.circulating_supply.toLocaleString(),
      max: coin.market_data.max_supply
        ? coin.market_data.max_supply.toLocaleString()
        : "Unknown",
      ath: `$${coin.market_data.ath.usd.toLocaleString()}`,
      athDate: new Date(coin.market_data.ath_date.usd).toLocaleDateString(),
      atl: `$${coin.market_data.atl.usd.toLocaleString()}`,
      atlDate: new Date(coin.market_data.atl_date.usd).toLocaleDateString(),
    }),
    [coin.market_data],
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <StatCard title="Circulating Supply" value={supplyData.circulating} />
      <StatCard title="Max Supply" value={supplyData.max} />
      <StatCard
        title="All Time High"
        value={supplyData.ath}
        subtitle={supplyData.athDate}
      />
      <StatCard
        title="All Time Low"
        value={supplyData.atl}
        subtitle={supplyData.atlDate}
      />
    </div>
  );
}

export function CoinStats({ coin }: { coin: CoinDetails }) {
  return (
    <section aria-label="Coin Statistics">
      <Tabs defaultValue="market" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="market">Market Data</TabsTrigger>
          <TabsTrigger value="supply">Supply</TabsTrigger>
        </TabsList>

        <TabsContent value="market">
          <MarketData coin={coin} />
        </TabsContent>

        <TabsContent value="supply">
          <SupplyData coin={coin} />
        </TabsContent>
      </Tabs>
    </section>
  );
}
