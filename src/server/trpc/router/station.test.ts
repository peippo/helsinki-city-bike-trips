import { describe, expect, test } from "vitest";
import { createContextInner } from "../context";
import { type AppRouter, appRouter } from "./_app";
import type { inferProcedureInput } from "@trpc/server";

describe("Station router", () => {
  test("should return list of stations", async () => {
    const ctx = await createContextInner({});
    const caller = appRouter.createCaller(ctx);

    const stations = await caller.station.getAll();

    expect(stations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          stationId: 1,
          name: "Kaivopuisto",
        }),
      ])
    );
  });

  test("should return single station", async () => {
    const ctx = await createContextInner({});
    const caller = appRouter.createCaller(ctx);

    const input: inferProcedureInput<AppRouter["station"]["getSingle"]> = {
      stationId: 1,
      month: 4,
    };

    const station = await caller.station.getSingle(input);

    expect(station?.name).toBe("Kaivopuisto");
  });

  test("should return stations traffic counts", async () => {
    const ctx = await createContextInner({});
    const caller = appRouter.createCaller(ctx);

    const input: inferProcedureInput<AppRouter["station"]["getTrafficCounts"]> =
      { month: 4 };

    const stations = await caller.station.getTrafficCounts(input);

    expect(stations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          stationId: 1,
          _count: {
            departures: expect.any(Number),
            arrivals: expect.any(Number),
          },
        }),
      ])
    );
  });
});
