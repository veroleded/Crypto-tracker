import { TRPCError } from "@trpc/server";
import { z } from "zod";



import { createTRPCRouter, publicProcedure } from "../trpc";


const coinSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  current_price: z.number(),
  price_change_percentage_24h: z.number(),
  image: z.string(),
});

export type Coin = z.infer<typeof coinSchema>;

export const coinRouter = createTRPCRouter({
  getTop100Coins: publicProcedure.query(async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false",
      );

      if (!response.ok) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch coins: ${response.status}`,
        });
      }
      console.log("response", response);

      const data = await response.json();
      return z.array(coinSchema).parse(data);
    } catch (error) {
      console.error("Error fetching coins:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch or parse coins data",
      });
    }
  }),
});