import { Prisma } from "@prisma/client";

type TrafficModes = "arrival" | "departure";
type TooltipTypes = "station" | "traffic" | "journey" | "journey-details";

const StationData = Prisma.validator<Prisma.StationArgs>()({
  include: { _count: { select: { departures: true, arrivals: true } } },
});

type StationData = Prisma.StationGetPayload<typeof StationData>;

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

type AggregationSource = {
  source: StationData;
};
