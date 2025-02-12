import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { coinDetailsSchema, coinSchema, marketChartSchema } from "../schemas/coin";
import { CacheService } from "./cache-service";

const COINGECKO_URL = "https://api.coingecko.com/api/v3";

if (!process.env.COINGECKO_API_KEY) {
  throw new Error("COINGECKO_API_KEY is not set");
}

const COINGECKO_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "x-cg-demo-api-key": process.env.COINGECKO_API_KEY
};

export class CoinGeckoService {
  private static async fetchFromApi<T>(
    path: string,
    params: Record<string, string | number>,
    schema: z.ZodType<T>,
  ): Promise<T> {
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      queryParams.append(key, String(value));
    }

    try {
      const response = await fetch(`${COINGECKO_URL}${path}?${queryParams.toString()}`, {
        headers: COINGECKO_HEADERS,
      });

      if (!response.ok) {
        const errorText = await response.text();

        if (response.status === 429) {
          console.warn("[CoinGecko] Rate limit exceeded:", {
            retryAfter: response.headers.get("retry-after"),
            rateLimit: response.headers.get("x-ratelimit-limit"),
            rateLimitRemaining: response.headers.get("x-ratelimit-remaining"),
          });

          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "Rate limit exceeded for CoinGecko API",
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch: ${response.status} - ${errorText}`,
        });
      }

      const rawData = await response.json();
      const validatedData = schema.safeParse(rawData);

      if (!validatedData.success) {
        console.error("[CoinGecko] Validation error:", validatedData.error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Invalid data format from API",
        });
      }

      return validatedData.data;
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      console.error("[CoinGecko] Error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch data from CoinGecko API",
      });
    }
  }

  static async getTop100Coins(page: number, perPage: number) {
    const cacheKey = `/coins/markets`;
    const params = {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: perPage,
      page,
      sparkline: "false",
    };
    const cachedData = await CacheService.getCoinGeckoData(
      cacheKey,
      params,
      z.array(coinSchema),
    );

    if (cachedData) {
      return cachedData;
    }

    const data = await this.fetchFromApi(cacheKey, params, z.array(coinSchema));

    await CacheService.setCoinGeckoData(cacheKey, params, data);

    return data;
  }

  static async getCoinDetails(id: string) {
    const cacheKey = `/coins/${id}`;
    const params = {
      localization: "false",
      tickers: "false",
      market_data: "true",
      community_data: "true",
      developer_data: "true",
      sparkline: "false",
    };

    const cachedData = await CacheService.getCoinGeckoData(
      cacheKey,
      params,
      coinDetailsSchema,
    );

    if (cachedData) {
      return cachedData;
    }

    const data = await this.fetchFromApi(cacheKey, params, coinDetailsSchema);

    await CacheService.setCoinGeckoData(cacheKey, params, data);

    return data;
  }

  static async getCoinsByIds(ids: string[]) {
    if (ids.length === 0) {
      return [];
    }

    const cacheKey = `/coins/markets`;
    const params = {
      vs_currency: "usd",
      ids: ids.join(","),
      order: "market_cap_desc",
      sparkline: "false",
    };

    const cachedData = await CacheService.getCoinGeckoData(
      cacheKey,
      params,
      z.array(coinSchema),
    );

    if (cachedData) {
      return cachedData;
    }

    const data = await this.fetchFromApi(cacheKey, params, z.array(coinSchema));

    await CacheService.setCoinGeckoData(cacheKey, params, data);

    return data;
  }

  static async getPriceHistory(coinId: string, timeframe: "24h" | "7d" | "30d") {
    const days = timeframe === "24h" ? 1 : timeframe === "7d" ? 7 : 30;
    const cacheKey = `/coins/${coinId}/market_chart`;
    const params = {
      vs_currency: "usd",
      days: days.toString(),
    };

    const cachedData = await CacheService.getCoinGeckoData(
      cacheKey,
      params,
      marketChartSchema,
    );

    if (cachedData) {
      return cachedData;
    }

    const data = await this.fetchFromApi(cacheKey, params, marketChartSchema);

    await CacheService.setCoinGeckoData(cacheKey, params, data);

    return data;
  }
} 