import { router } from "../trpc";
import { stationRouter } from "./station";
import { journeyRouter } from "./journey";

export const appRouter = router({
  station: stationRouter,
  journey: journeyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
