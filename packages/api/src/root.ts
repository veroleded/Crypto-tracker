import { authRouter } from "./router/auth";
import { coinRouter } from "./router/coin";
import { favoriteRouter } from "./router/favorite";
import { createTRPCRouter } from "./trpc";


export const appRouter = createTRPCRouter({
  auth: authRouter,
  coin: coinRouter,
  favorite: favoriteRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;