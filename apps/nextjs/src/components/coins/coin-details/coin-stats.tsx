import type { CoinDetails } from "@acme/api/";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui/tabs";

export function CoinStats({ coin }: { coin: CoinDetails }) {
  return (
    <section aria-label="Coin Statistics">
      <Tabs defaultValue="market" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="market">Market Data</TabsTrigger>
          <TabsTrigger value="supply">Supply</TabsTrigger>
        </TabsList>

        <TabsContent value="market">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Market Cap"
              value={`$${coin.market_data.market_cap.usd.toLocaleString()}`}
              subtitle={`Rank #${coin.market_data.market_cap_rank}`}
            />
            <StatCard
              title="Volume (24h)"
              value={`$${coin.market_data.total_volume.usd.toLocaleString()}`}
            />
            <StatCard
              title="Price"
              value={`$${coin.market_data.current_price.usd.toLocaleString()}`}
              subtitle={
                <>
                  <span className="inline-block">
                    24h: {coin.market_data.high_24h.usd.toLocaleString()} ↑
                  </span>
                  <span className="ml-2 inline-block">
                    {coin.market_data.low_24h.usd.toLocaleString()} ↓
                  </span>
                </>
              }
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard
              title="24h"
              value={`${coin.market_data.price_change_percentage_24h.toFixed(2)}%`}
              isPositive={coin.market_data.price_change_percentage_24h > 0}
            />
            <StatCard
              title="7d"
              value={`${coin.market_data.price_change_percentage_7d.toFixed(2)}%`}
              isPositive={coin.market_data.price_change_percentage_7d > 0}
            />
            <StatCard
              title="30d"
              value={`${coin.market_data.price_change_percentage_30d.toFixed(2)}%`}
              isPositive={coin.market_data.price_change_percentage_30d > 0}
            />
            <StatCard
              title="1y"
              value={`${coin.market_data.price_change_percentage_1y.toFixed(2)}%`}
              isPositive={coin.market_data.price_change_percentage_1y > 0}
            />
          </div>
        </TabsContent>

        <TabsContent value="supply">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard
              title="Circulating Supply"
              value={coin.market_data.circulating_supply.toLocaleString()}
            />
            <StatCard
              title="Max Supply"
              value={
                coin.market_data.max_supply
                  ? coin.market_data.max_supply.toLocaleString()
                  : "∞"
              }
            />
            <StatCard
              title="All Time High"
              value={`$${coin.market_data.ath.usd.toLocaleString()}`}
              subtitle={new Date(
                coin.market_data.ath_date.usd,
              ).toLocaleDateString()}
            />
            <StatCard
              title="All Time Low"
              value={`$${coin.market_data.atl.usd.toLocaleString()}`}
              subtitle={new Date(
                coin.market_data.atl_date.usd,
              ).toLocaleDateString()}
            />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  isPositive,
}: {
  title: string;
  value: string;
  subtitle?: React.ReactNode;
  isPositive?: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-lg bg-white p-4 shadow dark:bg-gray-800">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </h3>
      <p
        className={`mt-2 truncate text-lg font-semibold ${
          isPositive !== undefined
            ? isPositive
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
            : "text-gray-900 dark:text-white"
        }`}
      >
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
