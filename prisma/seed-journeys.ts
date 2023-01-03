import * as fs from "fs";
import * as path from "path";
import { Options, parse } from "csv-parse";
import { finished } from "stream/promises";
import type { PrismaClient } from "@prisma/client";

type Journey = {
  departureTime: Date;
  returnTime: Date;
  departureStationId: number;
  arrivalStationId: number;
  distance: number;
  duration: number;
};

const parserOptions: Options = {
  delimiter: ",",
  fromLine: 2,
  columns: [
    "departureTime",
    "returnTime",
    "departureStationId",
    null,
    "arrivalStationId",
    null,
    "distance",
    "duration",
  ],
  cast: (value, context) => {
    if (
      context.column === "departureStationId" ||
      context.column === "arrivalStationId" ||
      context.column === "distance" ||
      context.column === "duration"
    ) {
      return parseInt(value);
    } else if (
      context.column === "departureTime" ||
      context.column === "returnTime"
    ) {
      return new Date(value);
    } else {
      return value;
    }
  },
  onRecord: (value) => {
    if (
      !value.distance ||
      !value.duration ||
      value.distance < 10 ||
      value.duration < 10 ||
      value.departureStationId > 902 ||
      value.arrivalStationId > 902
    ) {
      return null;
    } else {
      return value;
    }
  },
};

const parseCSV = async (
  csvPath: string,
  options: Options
): Promise<Journey[]> => {
  const lines: Journey[] = [];
  const parser = fs.createReadStream(csvPath).pipe(
    parse({
      ...options,
    })
  );

  parser.on("readable", function () {
    let line;
    while ((line = parser.read()) !== null) {
      lines.push(line);
    }
  });

  await finished(parser);

  return lines;
};

export async function seedJourneys(prisma: PrismaClient) {
  console.log("Starting journeys seeding");

  const journeys = await parseCSV(
    path.resolve(__dirname, "../csv/journeys.csv"),
    parserOptions
  );

  await Promise.all(
    journeys.map((journey) => prisma.journey.create({ data: journey }))
  )
    .then(() => console.info("Journeys seeding done!"))
    .catch((e) => console.error("Journeys seeding failed", e));
}
