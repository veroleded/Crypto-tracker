"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@acme/ui/select";
import { Skeleton } from "@acme/ui/skeleton";

import { api } from "~/trpc/react";

interface CoinPriceChartProps {
  coinId: string;
}

interface ChartDataPoint {
  date: string;
  price: number;
  timestamp: number;
}

export function CoinPriceChart({ coinId }: CoinPriceChartProps) {
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d">("7d");

  const { data, isLoading } = api.coin.getPriceHistory.useQuery(
    { coinId, timeframe },
    {
      refetchInterval: 5 * 60 * 1000,
      staleTime: 2 * 60 * 1000,
    },
  );

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (!data?.prices.length) {
    return null;
  }

  const chartData: ChartDataPoint[] = data.prices.map(([timestamp, price]) => ({
    date: new Date(timestamp).toLocaleString('en-US', {
      ...(timeframe === "24h" ? {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      } : {
        month: 'short',
        day: 'numeric',
      }),
    }),
    price,
    timestamp,
  }));

  const minPrice = Math.min(...data.prices.map(([, price]) => price));
  const maxPrice = Math.max(...data.prices.map(([, price]) => price));
  const firstPrice = data.prices[0]?.[1] ?? 0;
  const lastPrice = data.prices[data.prices.length - 1]?.[1] ?? firstPrice;
  const priceChange = lastPrice - firstPrice;
  const priceChangePercentage = firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0;

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    });
  };

  const formatTooltipDate = (timestamp: number) => {
    const date = new Date(timestamp);
    if (timeframe === "24h") {
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Price Chart</CardTitle>
            <CardDescription>
              Price movement over selected period
            </CardDescription>
          </div>
          <Select
            value={timeframe}
            onValueChange={(value) => setTimeframe(value as "24h" | "7d" | "30d")}
          >
            <SelectTrigger className="w-28 sm:w-32">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 hours</SelectItem>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Low</p>
            <p className="text-base font-medium sm:text-lg">
              {formatPrice(minPrice)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">High</p>
            <p className="text-base font-medium sm:text-lg">
              {formatPrice(maxPrice)}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-sm text-muted-foreground">Change</p>
            <p
              className={`text-base font-medium sm:text-lg ${priceChangePercentage >= 0 ? "text-green-500" : "text-red-500"
                }`}
            >
              {priceChangePercentage >= 0 ? "+" : ""}
              {priceChangePercentage.toFixed(2)}%
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={priceChangePercentage >= 0 ? "#22c55e" : "#ef4444"}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={priceChangePercentage >= 0 ? "#22c55e" : "#ef4444"}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                tickMargin={10}
                minTickGap={30}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatPrice(value)}
                width={80}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: "12px",
                  padding: "8px 12px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value: number) => [formatPrice(value), "Price"]}
                labelFormatter={(label: string, data) => {
                  const point = data[0]?.payload as ChartDataPoint | undefined;
                  return point?.timestamp ? formatTooltipDate(point.timestamp) : "";
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={priceChangePercentage >= 0 ? "#22c55e" : "#ef4444"}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPrice)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-1 h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-28 sm:w-32" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-4 w-16" />
              <Skeleton className="mt-1 h-6 w-24" />
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[250px] w-full sm:h-[300px]" />
      </CardContent>
    </Card>
  );
} 