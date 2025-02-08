import { useMemo } from "react";

import type { CoinDetails } from "@acme/api";
import { Card, CardContent } from "@acme/ui/card";
import { cn } from "@acme/ui/utils";

interface Props {
  coin: CoinDetails;
}

export function CoinPrice({ coin }: Props) {
  const priceData = useMemo(() => {
    const priceChange = coin.market_data.price_change_percentage_24h;
    const isPositive = priceChange > 0;
    const formattedPrice = `$${coin.market_data.current_price.usd.toLocaleString()}`;
    const formattedChange = `${isPositive ? "+" : ""}${priceChange.toFixed(2)}%`;

    return {
      price: formattedPrice,
      change: formattedChange,
      isPositive,
    };
  }, [coin.market_data]);

  return (
    <Card className="overflow-hidden transition-colors hover:bg-accent/5">
      <CardContent className="p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Current Price
          </p>
          <div className="flex items-baseline gap-3">
            <p className="text-3xl font-bold tracking-tight">
              {priceData.price}
            </p>
            <p
              className={cn(
                "text-sm font-medium transition-colors",
                priceData.isPositive
                  ? "text-green-500 dark:text-green-400"
                  : "text-red-500 dark:text-red-400",
              )}
            >
              {priceData.change}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
