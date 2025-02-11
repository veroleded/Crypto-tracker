import { redis } from "@acme/db";
import { TRPCError } from "@trpc/server";
import type { z } from "zod";

const COINGECKO_URL = "https://api.coingecko.com/api/v3";
const CACHE_TTL = 60;
const RATE_LIMIT = 30;
const RATE_LIMIT_KEY = "coingecko:rate_limit";
const RATE_LIMIT_WINDOW = 60; // 1 minute in seconds

const COINGECKO_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

async function checkRateLimit(): Promise<boolean> {
  const currentRequests = await redis.incr(RATE_LIMIT_KEY);

  if (currentRequests === 1) {
    await redis.expire(RATE_LIMIT_KEY, RATE_LIMIT_WINDOW);
  }

  return currentRequests <= RATE_LIMIT;
}

async function getFromCache<T>(
  cacheKey: string,
  schema: z.ZodType<T>,
): Promise<T | null> {
  try {
    const cachedData = await redis.get<string>(cacheKey);
    if (!cachedData) return null;

    const validatedCache = schema.safeParse(cachedData);

    if (validatedCache.success) {
      return validatedCache.data;
    }

    console.error("Cache validation error:", validatedCache.error);
    return null;
  } catch (error) {
    console.error("Cache error:", error);
    return null;
  }
}

async function setCache<T>(cacheKey: string, data: T): Promise<void> {
  try {
    await redis.set(cacheKey, data, {
      ex: CACHE_TTL
    });
  } catch (error) {
    console.error("Cache set error:", error);
  }
}

export async function fetchFromApi<T>(
  path: string,
  params: Record<string, string | number>,
  schema: z.ZodType<T>,
): Promise<T> {
  const queryParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    queryParams.append(key, String(value));
  }

  const cacheKey = `coingecko:${path}:${queryParams.toString()}`;
  console.log("cacheKey", cacheKey);

  // Сначала пытаемся получить данные из кэша
  const cachedData = await getFromCache(cacheKey, schema);
  if (cachedData) {
    console.log("[CoinGecko] Using cached data for:", cacheKey);
    return cachedData;
  }

  // Проверяем лимит запросов
  const canMakeRequest = await checkRateLimit();
  if (!canMakeRequest) {
    // Пробуем получить данные из кэша еще раз (возможно, другой запрос уже обновил кэш)
    const fallbackData = await getFromCache(cacheKey, schema);
    if (fallbackData) {
      console.warn("[CoinGecko] Rate limit exceeded, using cached data for:", cacheKey);
      return fallbackData;
    }

    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Rate limit exceeded for CoinGecko API and no cached data available",
    });
  }

  try {
    const response = await fetch(`${COINGECKO_URL}${path}?${queryParams.toString()}`, {
      headers: COINGECKO_HEADERS,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[CoinGecko] API Error:", {
        status: response.status,
        statusText: response.statusText,
        errorText,
        path,
      });

      if (response.status === 429) {
        const fallbackData = await getFromCache(cacheKey, schema);
        if (fallbackData) {
          console.warn("[CoinGecko] Rate limit exceeded, using cached data for:", cacheKey);
          return fallbackData;
        }

        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Rate limit exceeded for CoinGecko API and no cached data available",
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

    // Кэшируем валидные данные
    await setCache(cacheKey, validatedData.data);
    console.log("[CoinGecko] Successfully cached data for:", cacheKey);

    return validatedData.data;
  } catch (error) {
    if (error instanceof TRPCError) throw error;

    console.error("[CoinGecko] Fetch error:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch data from CoinGecko API",
    });
  }
}