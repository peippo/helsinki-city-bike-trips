import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const journeyRouter = router({
  getBatch: publicProcedure
    .input(
      z.object({
        orderBy: z.enum(["distance", "duration", "departureTime"]),
        sortOrder: z.enum(["asc", "desc"]),
        month: z.number().min(4).max(9),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor, orderBy, sortOrder, month } = input;

      const items = await ctx.prisma.journey.findMany({
        take: limit + 1,
        where: {
          departureTime: {
            gte: new Date(`2021-${month}`),
            lte: new Date(`2021-${month + 1}`),
          },
        },
        select: {
          id: true,
          departureTime: true,
          returnTime: false,
          departureStationId: true,
          arrivalStationId: true,
          distance: true,
          duration: true,
          arrivalStation: {
            select: {
              longitude: true,
              latitude: true,
              name: true,
            },
          },
          departureStation: {
            select: {
              longitude: true,
              latitude: true,
              name: true,
            },
          },
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          [orderBy]: sortOrder,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
      };
    }),
});
