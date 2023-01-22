import type { STATION, TRAFFIC } from "@constants/index";

type PointType = {
  type: STATION | TRAFFIC;
};

export type TrafficData = {
  arrival: Array<JourneyPoints | undefined>;
  departure: Array<JourneyPoints | undefined>;
};

export type StationData = {
  coordinates: number[];
  capacity: number;
  name: string;
  stationId: number;
  arrivals: number;
  departures: number;
};

export type JourneyData = {
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

type StationPoint = StationData & PointType;
type JourneyPoints = JourneyData & PointType;
