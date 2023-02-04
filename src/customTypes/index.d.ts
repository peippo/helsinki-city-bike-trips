import { Prisma } from "@prisma/client";

type TrafficModes = "arrival" | "departure";
type TooltipTypes = "station" | "traffic" | "journey" | "journey-details";

const StationTrafficCounts = Prisma.validator<Prisma.StationArgs>()({
  select: { _count: { select: { departures: true, arrivals: true } } },
});

const StationId = Prisma.validator<Prisma.StationArgs>()({
  select: { stationId: true },
});

type StationTraffic = Prisma.StationGetPayload<typeof StationId> &
  Prisma.StationGetPayload<typeof StationTrafficCounts> & { name?: string };

type TrafficData = {
  arrival: {
    stations: StationsJourneyData[];
    averages: {
      distance: number;
      duration: number;
    };
  };
  departure: {
    stations: StationsJourneyData[];
    averages: {
      distance: number;
      duration: number;
    };
  };
};

type JourneyData = {
  arrival: {
    stationId: number;
    name: string;
    coordinates: [number, number, number];
  };
  departure: {
    stationId: number;
    name: string;
    coordinates: [number, number, number];
  };
};

type StationsJourneyData = JourneyData & {
  journeyCount: number;
  journeyPercentage: string;
};

type TrafficAggregationSource = {
  source: StationTraffic;
};
