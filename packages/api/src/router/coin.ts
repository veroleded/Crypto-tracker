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
        {
          headers: {
            Accept: "application/json",
          },
          next: { revalidate: 10 }, // кэшируем на 1 минуту
        },
      );

      if (!response.ok) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch coins: ${response.status}`,
        });
      }

      const rawData = (await response.json()) as Coin[];

      // Добавляем логирование для отладки
      console.log("Raw API response:", JSON.stringify(rawData).slice(0, 200));

      const validatedData = z.array(coinSchema).safeParse(rawData);

      if (!validatedData.success) {
        console.error("Validation error:", validatedData.error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Invalid data format from API",
        });
      }

      return validatedData.data;
    } catch (error) {
      console.error("Error in getTop100Coins:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch or parse coins data",
      });
    }
  }),

  // getDetailsById: publicProcedure.query(async (id: string) => {
  //   try {
  //     const response = await fetch("");

  //     if (!response.ok) {
  //       throw new TRPCError({
  //         code: "INTERNAL_SERVER_ERROR",
  //         message: `Failed to fetch coin: ${response.status}`,
  //       });
  //     }
  //     const data = (await response.json()) as Coin;
  //     return data;
  //   } catch (error) {
  //     console.error("Error fetching coins:", error);
  //     throw new TRPCError({
  //       code: "INTERNAL_SERVER_ERROR",
  //       message: "Failed to fetch or parse coins data",
  //     });
  //   }
  // }),
});
