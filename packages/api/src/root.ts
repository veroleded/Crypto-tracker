import { coinRouter } from "./router/coin";
import { favoriteRouter } from "./router/favorite";
import { purchaseRouter } from "./router/purchase";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  coin: coinRouter,
  favorite: favoriteRouter,
  purchase: purchaseRouter,
});

export type AppRouter = typeof appRouter;
