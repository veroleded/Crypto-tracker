import { redis } from "@acme/db";
import type { z } from "zod";

const CACHE_TTL = {
  COINGECKO: 60,
  AI_ANALYSIS: 60 * 30,
};

export class CacheService {
  private static generateKey(prefix: string, params: Record<string, unknown>): string {
    const sortedParams = Object.entries(params)
      .filter(([key]) => (key !== 'page') && (key !== 'per_page'))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}:${JSON.stringify(value)}`)
      .join(':');

    console.log(sortedParams)
    return `${prefix}:${sortedParams}`;
  }

  static async get<T>(
    prefix: string,
    params: Record<string, unknown>,
    schema: z.ZodType<T>,
  ): Promise<T | null> {
    try {
      const cacheKey = this.generateKey(prefix, params);
      console.log("[Cache] Attempting to get data:", {
        key: cacheKey,
        prefix,
        timestamp: new Date().toISOString(),
      });

      const cachedData = await redis.get<string>(cacheKey);

      if (!cachedData) {
        console.log("[Cache] Cache miss:", {
          key: cacheKey,
          prefix,
          timestamp: new Date().toISOString(),
        });
        return null;
      }

      const validatedCache = schema.safeParse(cachedData);

      if (!validatedCache.success) {
        console.warn("[Cache] Validation failed for cached data:", {
          key: cacheKey,
          prefix,
          error: validatedCache.error,
          timestamp: new Date().toISOString(),
        });
        return null;
      }

      console.log("[Cache] Cache hit:", {
        key: cacheKey,
        prefix,
        timestamp: new Date().toISOString(),
      });

      return validatedCache.data;
    } catch (error) {
      console.error("[Cache] Get error:", {
        prefix,
        params,
        error,
        timestamp: new Date().toISOString(),
      });
      return null;
    }
  }

  static async set(
    prefix: string,
    params: Record<string, unknown>,
    data: unknown,
    ttl: number,
  ): Promise<void> {
    try {
      const cacheKey = this.generateKey(prefix, params);
      console.log("[Cache] Setting data:", {
        key: cacheKey,
        prefix,
        ttl,
        timestamp: new Date().toISOString(),
      });

      await redis.set(cacheKey, data, {
        ex: ttl,
      });

      console.log("[Cache] Data successfully cached:", {
        key: cacheKey,
        prefix,
        ttl,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[Cache] Set error:", {
        prefix,
        params,
        ttl,
        error,
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async getCoinGeckoData<T>(
    path: string,
    params: Record<string, string | number>,
    schema: z.ZodType<T>,
  ): Promise<T | null> {
    return this.get('coingecko', { path, ...params }, schema);
  }

  static async setCoinGeckoData<T>(
    path: string,
    params: Record<string, string | number>,
    data: T,
  ): Promise<void> {
    return this.set('coingecko', { path, ...params }, data, CACHE_TTL.COINGECKO);
  }

  static async getAIAnalysis<T>(
    coinId: string,
    timeframe: string,
    schema: z.ZodType<T>,
  ): Promise<T | null> {
    return this.get('ai-analysis', { coinId, timeframe }, schema);
  }

  static async setAIAnalysis<T>(
    coinId: string,
    timeframe: string,
    data: T,
  ): Promise<void> {
    return this.set('ai-analysis', { coinId, timeframe }, data, CACHE_TTL.AI_ANALYSIS);
  }
} 