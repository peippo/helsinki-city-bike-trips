import { router } from "../trpc";
import { stationRouter } from "./station";

export const appRouter = router({
  station: stationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
