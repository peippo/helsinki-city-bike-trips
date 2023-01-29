import { describe, expect, test } from "vitest";
import * as utils from "./general";

describe("Utils", () => {
  test("getPercent", async () => {
    expect(utils.getPercent(0, 5)).toBe("0.0");
    expect(utils.getPercent(1, 3)).toBe("33.3");
    expect(utils.getPercent(1, 1)).toBe("100.0");
  });

  test("formatDistance", async () => {
    expect(utils.formatDistance(50)).toBe("50 m");
    expect(utils.formatDistance(1234)).toBe("1.23 km");
  });

  test("getAvgKilometers", async () => {
    expect(utils.getAvgKilometers(100, 1)).toBe(0.1);
    expect(utils.getAvgKilometers(2000, 4)).toBe(0.5);
  });

  test("getAvgMinutes", async () => {
    expect(utils.getAvgMinutes(300, 4)).toBe(1);
    expect(utils.getAvgMinutes(3600, 5)).toBe(12);
  });

  test("formatDateTime", async () => {
    expect(
      utils.formatDateTime(
        new Date(
          "Wed Jun 30 2021 00:30:22 GMT+0300 (Eastern European Summer Time)"
        )
      )
    ).toBe("30 Wed, 00:30");
  });

  test("formatDuration", async () => {
    expect(utils.formatDuration(30)).toBe("30 s");
    expect(utils.formatDuration(300)).toBe("5 min");
    expect(utils.formatDuration(310)).toBe("5 min 10 s");
    expect(utils.formatDuration(3600)).toBe("1 h");
    expect(utils.formatDuration(3665)).toBe("1 h 1 min 5 s");
    expect(utils.formatDuration(86400)).toBe("1 day");
    expect(utils.formatDuration(86465)).toBe("1 day 1 min 5 s");
    expect(utils.formatDuration(172800)).toBe("2 days");
  });
});
