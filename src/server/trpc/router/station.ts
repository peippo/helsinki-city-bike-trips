import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const stationRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.station.findMany({
      orderBy: { name: "asc" },
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
            ...whereDepartureTimeIs(month),
          },
          arrivals: {
            ...whereReturnTimeIs(month),
          },
        },
      });
    }),
  getTrafficCounts: publicProcedure
    .input(z.object({ month: z.number().min(4).max(9) }))

    .query(({ ctx, input }) => {
      const { month } = input;

      return ctx.prisma.station.findMany({
        select: {
          stationId: true,
          _count: {
            select: {
              departures: {
                ...whereDepartureTimeIs(month),
              },
              arrivals: {
                ...whereReturnTimeIs(month),
              },
            },
          },
        },
      });
    }),
});

const whereDepartureTimeIs = (month: number) => {
  return {
    where: {
      departureTime: {
        gte: new Date(`2021-${month}`),
        lte: new Date(`2021-${month + 1}`),
      },
    },
  };
};

const whereReturnTimeIs = (month: number) => {
  return {
    where: {
      returnTime: {
        gte: new Date(`2021-${month}`),
        lte: new Date(`2021-${month + 1}`),
      },
    },
  };
};
