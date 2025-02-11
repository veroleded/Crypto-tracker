import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { analyzeNewsData, analyzePriceData } from "../lib/ai-client";
import { fetchFromApi } from "../lib/coingecko-client";
import { createTRPCRouter, publicProcedure } from "../trpc";


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
      price_change_percentage_24h: z.number().optional(),
      price_change_percentage_7d: z.number().optional(),
      price_change_percentage_30d: z.number().optional(),
      price_change_percentage_1y: z.number().optional(),
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
      .nullable()
      .optional(),
    developer_data: z
      .object({
        forks: z.number().nullable(),
        stars: z.number().nullable(),
        subscribers: z.number().nullable(),
      })
      .nullable()
      .optional(),
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
      const requestId = `${input.page}-${input.perPage}`;
      console.log("[CoinGecko] Processing request:", {
        id: requestId,
        page: input.page,
        perPage: input.perPage,
        timestamp: new Date().toISOString(),
      });

      try {
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

        console.log("[CoinGecko] Request completed:", {
          id: requestId,
          timestamp: new Date().toISOString(),
        });

        return {
          coins,
          totalCoins: 100,
        };
      } catch (error) {
        console.error("[CoinGecko] Error in request:", {
          id: requestId,
          error,
          timestamp: new Date().toISOString(),
        });
        throw error;
      }
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

  getAIAnalysis: publicProcedure
    .input(
      z.object({
        coinId: z.string(),
        timeframe: z.enum(["24h", "7d", "30d"]).default("24h"),
      }),
    )
    .query(async ({ input }) => {
      try {
        const [historicalData, coinDetails] = await Promise.all([
          fetchFromApi(
            `/coins/${input.coinId}/market_chart`,
            {
              vs_currency: "usd",
              days: input.timeframe === "24h" ? "1" : input.timeframe === "7d" ? "7" : "30",
            },
            z.object({
              prices: z.array(z.tuple([z.number(), z.number()])),
              market_caps: z.array(z.tuple([z.number(), z.number()])),
              total_volumes: z.array(z.tuple([z.number(), z.number()])),
            }),
          ),
          fetchFromApi(
            `/coins/${input.coinId}`,
            {
              localization: "false",
              tickers: "false",
              market_data: "false",
              community_data: "false",
              developer_data: "false",
              sparkline: "false",
            },
            z.object({
              description: z.object({
                en: z.string(),
              }),
            }),
          ),
        ]);

        const [priceAnalysis, newsAnalysis] = await Promise.all([
          analyzePriceData({
            prices: historicalData.prices,
            marketCap: historicalData.market_caps,
            volume: historicalData.total_volumes,
            timeframe: input.timeframe,
          }),
          analyzeNewsData([
            {
              description: coinDetails.description.en,
              category: "general",
              created_at: new Date().toISOString(),
            },
          ]),
        ]);

        return {
          priceAnalysis,
          newsAnalysis,
        };
      } catch (error) {
        console.error("Error in AI analysis:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to perform AI analysis",
        });
      }
    }),

  getPriceHistory: publicProcedure
    .input(
      z.object({
        coinId: z.string(),
        timeframe: z.enum(["24h", "7d", "30d"]).default("7d"),
      }),
    )
    .query(async ({ input }) => {
      const days = input.timeframe === "24h" ? 1 : input.timeframe === "7d" ? 7 : 30;
      return await fetchFromApi(
        `/coins/${input.coinId}/market_chart`,
        {
          vs_currency: "usd",
          days: days.toString(),
        },
        z.object({
          prices: z.array(z.tuple([z.number(), z.number()])),
        }),
      );
    }),
});
