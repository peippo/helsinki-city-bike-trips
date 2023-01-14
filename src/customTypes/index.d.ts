import { STATION, TRAFFIC } from "@constants/index";

type PointType = {
  type: STATION | TRAFFIC;
};

export type StationData = {
  coordinates: number[];
  capacity: number;
  name: string;
  stationId: number;
  arrivals: number;
  departures: number;
};

export type DestinationData = {
  from: {
    name: string;
    coordinates: [number, number, number];
  };
  to: {
    stationId: number;
    name: string;
    coordinates: [number, number, number];
    tripCount: number;
    percentage: string;
  };
};

type StationPoint = StationData & PointType;
type DestinationPoint = DestinationData & PointType;
