import { authRouter } from "./router/auth";
import { coinRouter } from "./router/coin";
import { createTRPCRouter } from "./trpc";


export const appRouter = createTRPCRouter({
  auth: authRouter,
  coin: coinRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;