import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const journeyRouter = router({
  getBatch: publicProcedure
    .input(
      z.object({
        filter: z.enum(["distance", "duration", "departureTime"]),
        orderBy: z.enum(["asc", "desc"]),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor, filter, orderBy } = input;

      const items = await ctx.prisma.journey.findMany({
        take: limit + 1,
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
          [filter]: orderBy,
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
