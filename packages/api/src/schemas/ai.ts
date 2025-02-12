import { z } from "zod";

export const priceAnalysisSchema = z.object({
  trend: z.enum(["bullish", "bearish", "neutral"]),
  confidence: z.number().min(0).max(1),
  support: z.number(),
  resistance: z.number(),
  prediction: z.object({
    price: z.number(),
    timeframe: z.string(),
    probability: z.number().min(0).max(1),
  }),
  technicalIndicators: z.array(z.object({
    name: z.string(),
    value: z.string(),
    signal: z.enum(["buy", "sell", "hold"]),
  })),
});

export const newsAnalysisSchema = z.object({
  sentiment: z.enum(["positive", "negative", "neutral"]),
  score: z.number().min(-1).max(1),
  summary: z.string(),
  keyEvents: z.array(z.object({
    title: z.string(),
    impact: z.enum(["high", "medium", "low"]),
    sentiment: z.enum(["positive", "negative", "neutral"]),
  })),
});

export type PriceAnalysis = z.infer<typeof priceAnalysisSchema>;
export type NewsAnalysis = z.infer<typeof newsAnalysisSchema>;