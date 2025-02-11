"use client";

import { ArrowDown, ArrowUp, Brain, Loader2, Minus } from "lucide-react";
import { useState } from "react";

import { Button } from "@acme/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@acme/ui/select";
import { Separator } from "@acme/ui/separator";
import { cn } from "@acme/ui/utils";

import type { NewsAnalysis, PriceAnalysis } from "@acme/api";
import { api } from "~/trpc/react";

interface AIAnalysisData {
  priceAnalysis: PriceAnalysis;
  newsAnalysis: NewsAnalysis;
}

interface CoinAIAnalysisProps {
  coinId: string;
}

export function CoinAIAnalysis({ coinId }: CoinAIAnalysisProps) {
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d">("24h");
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = api.coin.getAIAnalysis.useQuery(
    { coinId, timeframe },
    {
      enabled: isOpen,
      refetchOnWindowFocus: false,
    },
  ) as { data: AIAnalysisData | undefined; isLoading: boolean; };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="w-full gap-2 md:w-auto"
        >
          <Brain className="h-4 w-4" />
          AI Analysis
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI Analysis</DialogTitle>
          <DialogDescription>
            Technical and news sentiment analysis
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Select Analysis Period</h2>
            <Select
              value={timeframe}
              onValueChange={(value) => setTimeframe(value as "24h" | "7d" | "30d")}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 hours</SelectItem>
                <SelectItem value="7d">7 days</SelectItem>
                <SelectItem value="30d">30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !data ? (
            <div className="text-center text-muted-foreground">
              Failed to load data
            </div>
          ) : (
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Price Analysis</CardTitle>
                  <CardDescription>
                    Technical analysis and price movement forecast
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Trend</span>
                    <div className="flex items-center gap-2">
                      {data.priceAnalysis.trend === "bullish" && (
                        <ArrowUp className="h-4 w-4 text-green-500" />
                      )}
                      {data.priceAnalysis.trend === "bearish" && (
                        <ArrowDown className="h-4 w-4 text-red-500" />
                      )}
                      {data.priceAnalysis.trend === "neutral" && (
                        <Minus className="h-4 w-4 text-yellow-500" />
                      )}
                      <span
                        className={cn(
                          "font-medium",
                          data.priceAnalysis.trend === "bullish" && "text-green-500",
                          data.priceAnalysis.trend === "bearish" && "text-red-500",
                          data.priceAnalysis.trend === "neutral" && "text-yellow-500",
                        )}
                      >
                        {data.priceAnalysis.trend === "bullish" && "Bullish"}
                        {data.priceAnalysis.trend === "bearish" && "Bearish"}
                        {data.priceAnalysis.trend === "neutral" && "Neutral"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Support Level</span>
                      <span className="font-medium">
                        ${data.priceAnalysis.support.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Resistance Level
                      </span>
                      <span className="font-medium">
                        ${data.priceAnalysis.resistance.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium">Technical Indicators</h4>
                    <div className="space-y-1">
                      {data.priceAnalysis.technicalIndicators.map((indicator) => (
                        <div
                          key={indicator.name}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-muted-foreground">
                            {indicator.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{indicator.value}</span>
                            <span
                              className={cn(
                                "text-xs font-medium",
                                indicator.signal === "buy" && "text-green-500",
                                indicator.signal === "sell" && "text-red-500",
                                indicator.signal === "hold" && "text-yellow-500",
                              )}
                            >
                              {indicator.signal === "buy" && "Buy"}
                              {indicator.signal === "sell" && "Sell"}
                              {indicator.signal === "hold" && "Hold"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="rounded-lg bg-muted p-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Price Forecast ({timeframe})</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Expected Price
                        </span>
                        <span className="font-medium">
                          ${data.priceAnalysis.prediction.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Probability
                        </span>
                        <span className="font-medium">
                          {(data.priceAnalysis.prediction.probability * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>News Analysis</CardTitle>
                  <CardDescription>
                    Analysis of news sentiment and key events
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Overall Sentiment</span>
                    <span
                      className={cn(
                        "font-medium",
                        data.newsAnalysis.sentiment === "positive" && "text-green-500",
                        data.newsAnalysis.sentiment === "negative" && "text-red-500",
                        data.newsAnalysis.sentiment === "neutral" && "text-yellow-500",
                      )}
                    >
                      {data.newsAnalysis.sentiment === "positive" && "Positive"}
                      {data.newsAnalysis.sentiment === "negative" && "Negative"}
                      {data.newsAnalysis.sentiment === "neutral" && "Neutral"}
                    </span>
                  </div>

                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm">{data.newsAnalysis.summary}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Key Events</h4>
                    <div className="space-y-2">
                      {data.newsAnalysis.keyEvents.map((event, index: number) => (
                        <div
                          key={index}
                          className="rounded-lg border border-border p-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{event.title}</span>
                            <span
                              className={cn(
                                "text-xs font-medium",
                                event.impact === "high" && "text-red-500",
                                event.impact === "medium" && "text-yellow-500",
                                event.impact === "low" && "text-green-500",
                              )}
                            >
                              {event.impact === "high" && "High Impact"}
                              {event.impact === "medium" && "Medium Impact"}
                              {event.impact === "low" && "Low Impact"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 