import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { Coin, CoinDetails } from "../schemas/coin";
import { AIService } from "../services/ai-service";
import { CoinGeckoService } from "../services/coingecko-service";
import { createTRPCRouter, publicProcedure } from "../trpc";

export type { Coin, CoinDetails };

export const coinRouter = createTRPCRouter({
  getTop100Coins: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        perPage: z.number().min(1).max(100).default(10),
      }),
    )
    .query(async ({ input }) => {
      console.log("[CoinGecko] Processing request:", {
        id: 'getTop100Coins',
        timestamp: new Date().toISOString(),
      });

      try {
        const coins = await CoinGeckoService.getTop100Coins(input.page, input.perPage);

        return {
          coins,
          totalCoins: 100,
        };
      } catch (error) {
        console.error("[CoinGecko] Error in request:", {
          id: 'getTop100Coins',
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
        console.log("[CoinGecko] Processing request:", {
          id: 'getDetailsById',
          coinId: id,
          timestamp: new Date().toISOString(),
        });

        return await CoinGeckoService.getCoinDetails(id);
      } catch (error) {
        console.error("[CoinGecko] Error fetching coin details:", {
          id: 'getDetailsById',
          coinId: id,
          error,
          timestamp: new Date().toISOString(),
        });
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
      console.log("[CoinGecko] Processing request:", {
        id: 'getByIds',
        ids: input.ids,
        timestamp: new Date().toISOString(),
      });

      if (input.ids.length === 0) {
        return { coins: [] };
      }

      try {
        const coins = await CoinGeckoService.getCoinsByIds(input.ids);
        return { coins };
      } catch (error) {
        console.error("[CoinGecko] Error fetching coins by ids:", {
          id: 'getByIds',
          ids: input.ids,
          error,
          timestamp: new Date().toISOString(),
        });
        throw error;
      }
    }),

  getAIAnalysis: publicProcedure
    .input(
      z.object({
        coinId: z.string(),
        timeframe: z.enum(["24h", "7d", "30d"]).default("24h"),
        coinDetails: z.object({
          description: z.string(),
          name: z.string(),
          symbol: z.string(),
          market_cap_rank: z.number(),
          market_data: z.object({
            current_price: z.object({ usd: z.number() }),
            market_cap: z.object({ usd: z.number() }),
            total_volume: z.object({ usd: z.number() }),
            price_change_percentage_24h: z.number().optional(),
            price_change_percentage_7d: z.number().optional(),
            price_change_percentage_30d: z.number().optional(),
          }),
        }),
      }),
    )
    .query(async ({ input }) => {
      console.log("[AI] Processing request:", {
        id: 'getAIAnalysis',
        coinId: input.coinId,
        timeframe: input.timeframe,
        timestamp: new Date().toISOString(),
      });

      try {
        return await AIService.getAnalysis(input);
      } catch (error) {
        console.error("[AI] Error in analysis:", {
          id: 'getAIAnalysis',
          coinId: input.coinId,
          timeframe: input.timeframe,
          error,
          timestamp: new Date().toISOString(),
        });
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
      try {
        console.log("[CoinGecko] Processing request:", {
          id: 'getPriceHistory',
          coinId: input.coinId,
          timeframe: input.timeframe,
          timestamp: new Date().toISOString(),
        });
        return await CoinGeckoService.getPriceHistory(input.coinId, input.timeframe);
      } catch (error) {
        console.error("[CoinGecko] Error fetching price history:", {
          id: 'getPriceHistory',
          coinId: input.coinId,
          timeframe: input.timeframe,
          error,
          timestamp: new Date().toISOString(),
        });
        throw error;
      }
    }),
});
