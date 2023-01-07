import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const stationRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.station.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            departures: true,
            arrivals: true,
          },
        },
      },
    });
  }),
  getSingle: publicProcedure
    .input(z.object({ stationId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.station.findUnique({
        where: {
          stationId: input.stationId,
        },
        include: {
          departures: true,
          arrivals: true,
        },
      });
    }),
});
