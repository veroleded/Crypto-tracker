import type { CoinDetails } from "@acme/api";
import { Card, CardContent } from "@acme/ui/card";
import { cn } from "@acme/ui/utils";

interface Props {
  coin: CoinDetails;
}

export function CoinPrice({ coin }: Props) {
  const priceChange = coin.market_data.price_change_percentage_24h;
  const isPositive = priceChange > 0;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Current Price</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">
              ${coin.market_data.current_price.usd.toLocaleString()}
            </p>
            <p
              className={cn(
                "text-sm",
                isPositive ? "text-green-500" : "text-red-500",
              )}
            >
              {isPositive ? "+" : ""}
              {priceChange.toFixed(2)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
