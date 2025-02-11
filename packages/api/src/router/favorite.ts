import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { Favorite } from "@acme/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const favoriteRouter = createTRPCRouter({
  add: protectedProcedure
    .input(z.object({ coinId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      return ctx.db
        .insert(Favorite)
        .values({
          userId,
          coinId: input.coinId,
        })
        .onConflictDoNothing({
          target: [Favorite.userId, Favorite.coinId],
        });
    }),

  remove: protectedProcedure
    .input(z.object({ coinId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      return ctx.db
        .delete(Favorite)
        .where(
          and(eq(Favorite.userId, userId), eq(Favorite.coinId, input.coinId)),
        );
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const favorites = await ctx.db.query.Favorite.findMany({
      where: eq(Favorite.userId, userId),
      columns: {
        coinId: true,
      },
      orderBy: [Favorite.createdAt],
    });

    return {
      favorites,
    };
  }),

  isFavorite: protectedProcedure
    .input(z.object({ coinId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const favorite = await ctx.db.query.Favorite.findFirst({
        where: and(
          eq(Favorite.userId, userId),
          eq(Favorite.coinId, input.coinId),
        ),
      });

      return !!favorite;
    }),
});
