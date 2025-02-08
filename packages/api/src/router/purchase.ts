import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { CoinPurchase } from "@acme/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const purchaseRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        coinId: z.string(),
        amount: z.number().positive(),
        purchasePrice: z.number().positive(),
        purchaseDate: z.string().transform((date) => new Date(date)),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      return ctx.db.insert(CoinPurchase).values({
        userId,
        coinId: input.coinId,
        amount: input.amount.toString(),
        purchasePrice: input.purchasePrice.toString(),
        purchaseDate: input.purchaseDate,
      });
    }),

  getByCoinId: protectedProcedure
    .input(z.object({ coinId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      return ctx.db.query.CoinPurchase.findMany({
        where: and(
          eq(CoinPurchase.userId, userId),
          eq(CoinPurchase.coinId, input.coinId),
        ),
        orderBy: [desc(CoinPurchase.purchaseDate)],
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      return ctx.db
        .delete(CoinPurchase)
        .where(
          and(
            eq(CoinPurchase.id, input.id),
            eq(CoinPurchase.userId, userId),
          ),
        );
    }),
}); 