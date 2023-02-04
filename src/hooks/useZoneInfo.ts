import { trpc } from "@utils/trpc";
import { useAtom } from "jotai";
import { trafficZoneAtom } from "@hooks/useMapLayers";
import type { TrafficAggregationSource, StationTraffic } from "customTypes";

/**
 * Get details from selected traffic zone
 */
const useZoneInfo = () => {
  const { data: stations } = trpc.station.getAll.useQuery();
  const [trafficZone] = useAtom(trafficZoneAtom);

  // Get stations from HexagonLayer aggregation bin & add station name
  const zoneStations: StationTraffic[] = trafficZone?.object.points.map(
    (z: TrafficAggregationSource) => {
      return {
        name: stations?.find((s) => s.stationId === z.source.stationId)?.name,
        ...z.source,
      };
    }
  );

  // Sort stations by traffic
  zoneStations?.sort(
    (a: StationTraffic, b: StationTraffic) =>
      b._count.arrivals +
      b._count.departures -
      (a._count.arrivals + a._count.departures)
  );

  // Sum capacity, arrival & departure counts from all stations in the zone
  const zoneTotals = zoneStations?.reduce(
    (totals, station) => {
      return {
        capacity: (totals.capacity +=
          stations?.find((s) => s.stationId === station.stationId)?.capacity ??
          0),
        arrivals: (totals.arrivals += station._count.arrivals),
        departures: (totals.departures += station._count.departures),
      };
    },
    { capacity: 0, arrivals: 0, departures: 0 }
  );

  return { zoneStations, zoneTotals };
};

export default useZoneInfo;
