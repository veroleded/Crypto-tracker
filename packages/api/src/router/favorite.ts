import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { Favorite } from "@acme/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const favoriteRouter = createTRPCRouter({
  // Добавить монету в избранное
  add: protectedProcedure
    .input(z.object({ coinId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Проверяем, не добавлена ли уже монета
      const existing = await ctx.db.query.Favorite.findFirst({
        where: and(
          eq(Favorite.userId, userId),
          eq(Favorite.coinId, input.coinId),
        ),
      });

      if (existing) {
        throw new Error("Монета уже в избранном");
      }

      // Добавляем монету в избранное
      return ctx.db.insert(Favorite).values({
        userId,
        coinId: input.coinId,
      });
    }),

  // Удалить монету из избранного
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

  // Получить все избранные монеты пользователя
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const favorites = await ctx.db.query.Favorite.findMany({
      where: eq(Favorite.userId, userId),
      columns: {
        coinId: true,
      },
    });

    return {
      favorites,
    };
  }),

  // Проверить, находится ли монета в избранном
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