import { redis } from "@acme/db";
import { TRPCError } from "@trpc/server";
import type { z } from "zod";

const COINGECKO_URL = "https://api.coingecko.com/api/v3";
const CACHE_TTL = 60;
const RATE_LIMIT = 30;
const RATE_LIMIT_KEY = "coingecko:rate_limit";
const RATE_LIMIT_WINDOW = 60;

if (!process.env.COINGECKO_API_KEY) {
  throw new Error("COINGECKO_API_KEY is not set");
}

const COINGECKO_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "x-cg-demo-api-key": process.env.COINGECKO_API_KEY
};

async function checkRateLimit(): Promise<boolean> {
  const currentRequests = await redis.incr(RATE_LIMIT_KEY);

  if (currentRequests === 1) {
    await redis.expire(RATE_LIMIT_KEY, RATE_LIMIT_WINDOW);
  }

  const ttl = await redis.ttl(RATE_LIMIT_KEY);
  const isLimitExceeded = currentRequests > RATE_LIMIT;


  if (isLimitExceeded || (RATE_LIMIT - currentRequests) < 5) {
    console.warn("[API] Rate limit status:", {
      remaining: RATE_LIMIT - currentRequests,
      resetIn: `${ttl}s`,
    });
  }

  return !isLimitExceeded;
}

async function getFromCache<T>(
  cacheKey: string,
  schema: z.ZodType<T>,
): Promise<T | null> {
  try {
    const cachedData = await redis.get<string>(cacheKey);
    if (!cachedData) return null;

    const validatedCache = schema.safeParse(cachedData);
    return validatedCache.success ? validatedCache.data : null;
  } catch (error) {
    console.error("[Cache] Error:", error);
    return null;
  }
}

async function setCache<T>(cacheKey: string, data: T): Promise<void> {
  try {
    await redis.set(cacheKey, data, {
      ex: CACHE_TTL
    });
  } catch (error) {
    console.error("[Cache] Error:", error);
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


  const cachedData = await getFromCache(cacheKey, schema);
  if (cachedData) return cachedData;


  const canMakeRequest = await checkRateLimit();
  if (!canMakeRequest) {
    const fallbackData = await getFromCache(cacheKey, schema);
    if (fallbackData) return fallbackData;

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

      if (response.status === 429) {
        const retryAfter = response.headers.get("retry-after");
        const rateLimit = response.headers.get("x-ratelimit-limit");
        const rateLimitRemaining = response.headers.get("x-ratelimit-remaining");

        console.warn("[API] CoinGecko rate limit:", {
          limit: rateLimit,
          remaining: rateLimitRemaining,
          retryAfter: retryAfter ? `${retryAfter}s` : 'unknown'
        });

        const fallbackData = await getFromCache(cacheKey, schema);
        if (fallbackData) return fallbackData;

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
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Invalid data format from API",
      });
    }

    await setCache(cacheKey, validatedData.data);
    return validatedData.data;
  } catch (error) {
    if (error instanceof TRPCError) throw error;

    console.error("[API] Error:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch data from CoinGecko API",
    });
  }
}


