import type { STATION, TRAFFIC } from "@constants/index";

type PointType = {
  type: STATION | TRAFFIC;
};

export type TrafficData = {
  arrival: Array<RoutePoints | undefined>;
  departure: Array<RoutePoints | undefined>;
};

export type StationData = {
  coordinates: number[];
  capacity: number;
  name: string;
  stationId: number;
  arrivals: number;
  departures: number;
};

export type RouteData = {
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
  tripCount: number;
  percentage: string;
};

type StationPoint = StationData & PointType;
type RoutePoints = RouteData & PointType;
