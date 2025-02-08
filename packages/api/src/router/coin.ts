import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

const COINGECKO_URL = "https://api.coingecko.com/api/v3";

const COINGECKO_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

async function fetchFromApi<T>(
  path: string,
  params: Record<string, string | number>,
  schema: z.ZodType<T>,
): Promise<T> {
  const queryParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    queryParams.append(key, String(value));
  }

  const response = await fetch(`${COINGECKO_URL}${path}?${queryParams}`, {
    headers: COINGECKO_HEADERS,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("CoinGecko API Error:", {
      status: response.status,
      statusText: response.statusText,
      errorText,
    });

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to fetch: ${response.status} - ${errorText}`,
    });
  }

  const rawData = await response.json();
  const validatedData = schema.safeParse(rawData);

  if (!validatedData.success) {
    console.error("Validation error:", validatedData.error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Invalid data format from API",
    });
  }

  return validatedData.data;
}

const coinSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  current_price: z.number(),
  price_change_percentage_24h: z.number(),
  image: z.string(),
});

const coinDetailsSchema = z
  .object({
    id: z.string(),
    symbol: z.string(),
    name: z.string(),
    description: z
      .object({
        en: z.string(),
      })
      .nullable(),
    image: z.object({
      large: z.string(),
      small: z.string(),
      thumb: z.string(),
    }),
    market_data: z.object({
      current_price: z.object({
        usd: z.number(),
      }),
      market_cap_rank: z.number(),
      market_cap: z.object({
        usd: z.number(),
      }),
      total_volume: z.object({
        usd: z.number(),
      }),
      high_24h: z.object({
        usd: z.number(),
      }),
      low_24h: z.object({
        usd: z.number(),
      }),
      price_change_percentage_24h: z.number(),
      price_change_percentage_7d: z.number(),
      price_change_percentage_30d: z.number(),
      price_change_percentage_1y: z.number(),
      circulating_supply: z.number(),
      total_supply: z.number().nullable(),
      max_supply: z.number().nullable(),
      ath: z.object({
        usd: z.number(),
      }),
      ath_date: z.object({
        usd: z.string(),
      }),
      atl: z.object({
        usd: z.number(),
      }),
      atl_date: z.object({
        usd: z.string(),
      }),
    }),
    links: z
      .object({
        homepage: z.array(z.string()),
        blockchain_site: z.array(z.string()),
        official_forum_url: z.array(z.string()),
        twitter_screen_name: z.string().nullable(),
        telegram_channel_identifier: z.string().nullable(),
        subreddit_url: z.string().nullable(),
      })
      .nullable(),
    genesis_date: z.string().nullable(),
    community_data: z
      .object({
        twitter_followers: z.number().nullable(),
        reddit_subscribers: z.number().nullable(),
      })
      .nullable(),
    developer_data: z
      .object({
        forks: z.number().nullable(),
        stars: z.number().nullable(),
        subscribers: z.number().nullable(),
      })
      .nullable(),
  })
  .passthrough();

export type Coin = z.infer<typeof coinSchema>;
export type CoinDetails = z.infer<typeof coinDetailsSchema>;

export const coinRouter = createTRPCRouter({
  getTop100Coins: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        perPage: z.number().min(1).max(100).default(10),
      }),
    )
    .query(async ({ input }) => {
      const coins = await fetchFromApi(
        "/coins/markets",
        {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: input.perPage,
          page: input.page,
          sparkline: "false",
        },
        z.array(coinSchema),
      );

      return {
        coins,
        totalCoins: 100, // CoinGecko API limit
      };
    }),

  getDetailsById: publicProcedure
    .input(z.string())
    .query(async ({ input: id }) => {
      try {
        return await fetchFromApi(
          `/coins/${id}`,
          {
            localization: "false",
            tickers: "false",
            market_data: "true",
            community_data: "true",
            developer_data: "true",
            sparkline: "false",
          },
          coinDetailsSchema,
        );
      } catch (error) {
        console.error("Error fetching coin details:", error);
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch coin details",
        });
      }
    }),

  getByIds: publicProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .query(async ({ input }) => {
      if (input.ids.length === 0) {
        return { coins: [] };
      }

      const coins = await fetchFromApi(
        "/coins/markets",
        {
          vs_currency: "usd",
          ids: input.ids.join(","),
          order: "market_cap_desc",
          sparkline: "false",
        },
        z.array(coinSchema),
      );

      return {
        coins,
      };
    }),
});
