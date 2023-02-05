import { describe, expect, test } from "vitest";
import { createContextInner } from "../context";
import { type AppRouter, appRouter } from "./_app";
import type { inferProcedureInput } from "@trpc/server";

describe("Journey router", () => {
  test("should return journeys", async () => {
    const ctx = await createContextInner({});
    const caller = appRouter.createCaller(ctx);

    const input: inferProcedureInput<AppRouter["journey"]["getBatch"]> = {
      orderBy: "distance",
      sortOrder: "asc",
      month: 4,
    };

    const journeys = await caller.journey.getBatch(input);

    expect(journeys).toEqual(
      expect.objectContaining({
        items: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            departureTime: expect.any(Date),
            departureStationId: expect.any(Number),
            arrivalStationId: expect.any(Number),
            departureStation: expect.objectContaining({
              latitude: expect.any(Number),
              longitude: expect.any(Number),
              name: expect.any(String),
            }),
            arrivalStation: expect.objectContaining({
              latitude: expect.any(Number),
              longitude: expect.any(Number),
              name: expect.any(String),
            }),
            distance: expect.any(Number),
            duration: expect.any(Number),
          }),
        ]),
      })
    );
  });
});
