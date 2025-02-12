import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { NewsAnalysis, PriceAnalysis } from "../schemas/ai";
import { newsAnalysisSchema, priceAnalysisSchema } from "../schemas/ai";
import { CacheService } from "./cache-service";
import { CoinGeckoService } from "./coingecko-service";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set");
}

const API_URL = "https://api.proxyapi.ru/deepseek";

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}


export class AIService {
  private static async makeRequest(endpoint: string, body: unknown): Promise<ChatCompletionResponse> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.error('[AI] API Error:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url
      });

      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = await response.text();
      }

      console.error('[AI] Error details:', errorData);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "AI API request failed",
      });
    }

    return response.json() as Promise<ChatCompletionResponse>;
  }

  static async getAnalysis(params: {
    coinId: string;
    timeframe: "24h" | "7d" | "30d";
    coinDetails: {
      description: string;
      name: string;
      symbol: string;
      market_cap_rank: number;
      market_data: {
        current_price: { usd: number; };
        market_cap: { usd: number; };
        total_volume: { usd: number; };
        price_change_percentage_24h?: number;
        price_change_percentage_7d?: number;
        price_change_percentage_30d?: number;
      };
    };
  }) {
    try {
      const cachedAnalysis = await CacheService.getAIAnalysis(
        params.coinId,
        params.timeframe,
        z.object({
          priceAnalysis: z.any(),
          newsAnalysis: z.any(),
        }),
      );

      if (cachedAnalysis) {
        console.log("[AI] Using cached analysis for", params.coinId);
        return cachedAnalysis;
      }

      const historicalData = await CoinGeckoService.getPriceHistory(
        params.coinId,
        params.timeframe,
      );

      const [priceAnalysis, newsAnalysis] = await Promise.all([
        this.analyzePriceData({
          prices: historicalData.prices,
          marketCap: historicalData.market_caps,
          volume: historicalData.total_volumes,
          timeframe: params.timeframe,
          currentPrice: params.coinDetails.market_data.current_price.usd,
          priceChange: {
            "24h": params.coinDetails.market_data.price_change_percentage_24h,
            "7d": params.coinDetails.market_data.price_change_percentage_7d,
            "30d": params.coinDetails.market_data.price_change_percentage_30d,
          },
        }),
        this.analyzeNewsData({
          description: params.coinDetails.description,
          name: params.coinDetails.name,
          symbol: params.coinDetails.symbol,
          market_cap_rank: params.coinDetails.market_cap_rank,
          market_cap: params.coinDetails.market_data.market_cap.usd,
          volume: params.coinDetails.market_data.total_volume.usd,
        }),
      ]);

      const result = {
        priceAnalysis,
        newsAnalysis,
      };

      await CacheService.setAIAnalysis(
        params.coinId,
        params.timeframe,
        result,
      );

      return result;
    } catch (error) {
      console.error("[AI] Error in analysis:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to perform AI analysis",
      });
    }
  }

  private static async analyzePriceData(data: {
    prices: [number, number][];
    marketCap: [number, number][];
    volume: [number, number][];
    timeframe: string;
    currentPrice: number;
    priceChange: {
      "24h"?: number;
      "7d"?: number;
      "30d"?: number;
    };
  }): Promise<PriceAnalysis> {
    const formattedPrices = data.prices
      .map(([timestamp, price]) => ({
        date: new Date(timestamp).toISOString(),
        price,
      }))
      .slice(-50)
      .map(({ date, price }) => `${date}: $${price.toLocaleString()}`);

    const prompt = `You are an experienced cryptocurrency market analyst. Analyze the following cryptocurrency data:

HISTORICAL DATA:
1. Historical Prices (last 50 points):
${formattedPrices.join("\n")}

CURRENT STATE:
- Current Price: $${data.currentPrice.toLocaleString()}
- Market Cap: $${data.marketCap[data.marketCap.length - 1]?.[1].toLocaleString()}
- Trading Volume: $${data.volume[data.volume.length - 1]?.[1].toLocaleString()}
- Analysis Timeframe: ${data.timeframe}

PRICE CHANGES:
- 24h Change: ${data.priceChange["24h"]?.toFixed(2) ?? "N/A"}%
- 7d Change: ${data.priceChange["7d"]?.toFixed(2) ?? "N/A"}%
- 30d Change: ${data.priceChange["30d"]?.toFixed(2) ?? "N/A"}%

ANALYSIS INSTRUCTIONS:
1. Determine the current trend based on:
   - Price dynamics
   - Trading volumes
   - Market capitalization
2. Calculate support and resistance levels using:
   - Historical highs and lows
   - Volume profiles at different price levels
3. Analyze technical indicators:
   - RSI (Relative Strength Index)
   - MACD (Moving Average Convergence Divergence)
   - Bollinger Bands
4. Make a price prediction for the specified timeframe considering:
   - Current trend
   - Technical indicators
   - Support and resistance levels

Return the result in the following JSON format:
{
  "trend": "bullish" | "bearish" | "neutral", // overall trend
  "confidence": number (0-1), // analysis confidence
  "support": number, // nearest support level
  "resistance": number, // nearest resistance level
  "prediction": {
    "price": number, // predicted price
    "timeframe": string, // prediction timeframe
    "probability": number (0-1) // probability of reaching the price
  },
  "technicalIndicators": [
    {
      "name": string, // indicator name
      "value": string, // current value
      "signal": "buy" | "sell" | "hold" // trading signal
    }
  ]
}`;

    try {
      const requestBody = {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are a cryptocurrency market analyst. Analyze the data and return insights in the specified JSON format.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 800,
        temperature: 0.3
      };

      console.log('[AI] Sending price analysis request');
      const response = await this.makeRequest('/chat/completions', requestBody);
      const result = response.choices[0]?.message?.content;

      if (!result) {
        throw new Error("No content in response");
      }

      const parsedResult = JSON.parse(result);
      return priceAnalysisSchema.parse(parsedResult);
    } catch (error) {
      console.error("[AI] Price analysis failed:", error);
      throw error;
    }
  }

  private static async analyzeNewsData(data: {
    description: string;
    name: string;
    symbol: string;
    market_cap_rank: number;
    market_cap: number;
    volume: number;
  }): Promise<NewsAnalysis> {
    const newsData = {
      description: data.description,
      category: "general",
      created_at: new Date().toISOString(),
      metadata: {
        name: data.name,
        symbol: data.symbol,
        market_cap_rank: data.market_cap_rank,
        market_cap: data.market_cap,
        volume: data.volume,
      }
    };

    const formattedNews =
      `[${newsData.category}] ${new Date(newsData.created_at).toISOString()}: ${newsData.description}\n` +
      `Metadata: ${newsData.metadata.name} (${newsData.metadata.symbol.toUpperCase()})\n` +
      `Market Cap Rank: #${newsData.metadata.market_cap_rank}\n` +
      `Market Cap: $${newsData.metadata.market_cap.toLocaleString()}\n` +
      `Volume: $${newsData.metadata.volume.toLocaleString()}`;

    const prompt = `You are an experienced cryptocurrency news analyst. Analyze the following news and data:

NEWS DATA:
${formattedNews}

ANALYSIS INSTRUCTIONS:
1. Evaluate overall news sentiment considering:
   - News tone and context
   - Market impact
   - Potential effect on investors
2. Identify key events by evaluating:
   - Event importance for the project
   - Potential price impact
   - Long-term implications
3. Create a concise summary including:
   - Main trends
   - Potential risks
   - Growth opportunities

Return the result in the following JSON format:
{
  "sentiment": "positive" | "negative" | "neutral", // overall sentiment
  "score": number (-1 to 1), // sentiment score
  "summary": string, // analysis summary
  "keyEvents": [
    {
      "title": string, // event title
      "impact": "high" | "medium" | "low", // impact level
      "sentiment": "positive" | "negative" | "neutral" // event sentiment
    }
  ]
}`;

    try {
      const requestBody = {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are a cryptocurrency news analyst. Analyze the news and return insights in the specified JSON format.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 800,
        temperature: 0.3
      };

      console.log('[AI] Sending news analysis request');
      const response = await this.makeRequest('/chat/completions', requestBody);
      const result = response.choices[0]?.message?.content;

      if (!result) {
        throw new Error("No content in response");
      }

      const parsedResult = JSON.parse(result);
      return newsAnalysisSchema.parse(parsedResult);
    } catch (error) {
      console.error("[AI] News analysis failed:", error);
      throw error;
    }
  }
}