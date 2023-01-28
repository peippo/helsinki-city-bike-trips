import { Prisma } from "@prisma/client";

const StationData = Prisma.validator<Prisma.StationArgs>()({
  include: { _count: { select: { departures: true, arrivals: true } } },
});

type StationData = Prisma.StationGetPayload<typeof StationData>;

type TrafficModes = "arrival" | "departure";

type TooltipTypes = "station" | "traffic" | "journey";

type TrafficData = {
  arrival: {
    stations: JourneyPoints[];
    averages: {
      distance: number;
      duration: number;
    };
  };
  departure: {
    stations: JourneyPoints[];
    averages: {
      distance: number;
      duration: number;
    };
  };
};

type JourneyData = {
  departure: {
    stationId: number;
    name: string;
    coordinates: [number, number, number];
  };
  arrival: {
    stationId: number;
    name: string;
    coordinates: [number, number, number];
  };
  journeyCount: number;
  journeyPercentage: string;
};

type AggregationSource = {
  source: StationData;
};
