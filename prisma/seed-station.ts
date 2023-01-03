import * as fs from "fs";
import * as path from "path";
import { Options, parse } from "csv-parse";
import { finished } from "stream/promises";
import type { PrismaClient } from "@prisma/client";

type Station = {
  stationId: number;
  name: string;
  address: string;
  city: string;
  capacity: number;
  longitude: number;
  latitude: number;
};

const parserOptions: Options = {
  delimiter: ",",
  fromLine: 2,
  columns: [
    null,
    "stationId",
    "name",
    null,
    null,
    "address",
    null,
    "city",
    null,
    null,
    "capacity",
    "longitude",
    "latitude",
  ],
  cast: (value, context) => {
    if (context.column === "stationId" || context.column === "capacity") {
      return parseInt(value);
    } else if (
      context.column === "longitude" ||
      context.column === "latitude"
    ) {
      return parseFloat(value);
    } else {
      return value;
    }
  },
};

const parseCSV = async (
  csvPath: string,
  options: Options
): Promise<Station[]> => {
  const lines: Station[] = [];
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

export async function seedStations(prisma: PrismaClient) {
  console.log("Starting stations seeding");

  const stations = await parseCSV(
    path.resolve(__dirname, "../csv/stations.csv"),
    parserOptions
  );

  await Promise.all(
    stations.map((station) => prisma.station.create({ data: station }))
  )
    .then(() => console.info("Stations seeding done!"))
    .catch((e) => console.error("Stations seeding failed", e));
}
