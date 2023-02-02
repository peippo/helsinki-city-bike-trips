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
    .input(z.object({ stationId: z.number(), month: z.number().min(4).max(9) }))
    .query(({ ctx, input }) => {
      const { stationId, month } = input;

      return ctx.prisma.station.findUnique({
        where: {
          stationId: stationId,
        },
        include: {
          departures: {
            where: {
              departureTime: {
                gte: new Date(`2021-${month}-01`),
                lte: new Date(`2021-${month}-31`),
              },
            },
          },
          arrivals: {
            where: {
              departureTime: {
                gte: new Date(`2021-${month}-01`),
                lte: new Date(`2021-${month}-31`),
              },
            },
          },
        },
      });
    }),
});
