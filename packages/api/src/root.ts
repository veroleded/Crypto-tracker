import { authRouter } from "./router/auth";
import { coinRouter } from "./router/coin";
// import { postRouter } from "./router/post";
import { createTRPCRouter } from "./trpc";


export const appRouter = createTRPCRouter({
  auth: authRouter,
  // post: postRouter,
  coin: coinRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;