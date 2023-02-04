import { trpc } from "@utils/trpc";
import { useRouter } from "next/router";
import { atom, useAtom } from "jotai";
import { HexagonLayer } from "@deck.gl/aggregation-layers/typed";
import { selectedMonthAtom } from "@components/MonthSelector";
import { hoverInfoAtom } from "@components/Map/Map";
import type { Station } from "@prisma/client";
import type { StationTraffic } from "customTypes";
import type { PickingInfo } from "@deck.gl/core/typed";

export const trafficZoneAtom = atom<PickingInfo | null>(null);

const useTrafficLayers = () => {
  const [, setHoverInfo] = useAtom(hoverInfoAtom);
  const [selectedMonth] = useAtom(selectedMonthAtom);
  const [trafficZone, setTrafficZone] = useAtom(trafficZoneAtom);
  const router = useRouter();
  const { data: stations } = trpc.station.getAll.useQuery();
  const { data: traffic } = trpc.station.getTrafficCounts.useQuery(
    { month: selectedMonth },
    { enabled: router.route === "/traffic" }
  );

  const trafficLayer = new HexagonLayer({
    id: "traffic-layer",
    data: traffic,
    radius: 500,
    coverage: 0.9,
    colorAggregation: "SUM",
    colorScaleType: "quantile",
    extruded: true,
    pickable: true,
    elevationRange: [0, 1200],
    elevationScale: 5,
    opacity: 0.75,
    highlightedObjectIndex: trafficZone ? trafficZone.index : -1,
    colorRange: [
      [22, 90, 205],
      [45, 120, 205],
      [122, 120, 225],
      [178, 140, 235],
      [248, 170, 255],
      [240, 204, 80],
    ],
    autoHighlight: true,
    transitions: {
      getElevationValue: 500,
      getColorValue: 500,
    },
    getColorWeight: (station: StationTraffic) =>
      station._count.arrivals + station._count.departures,
    getPosition: (station) => {
      const stationInfo = stations?.find(
        (s) => s.stationId === station.stationId
      ) as Station;

      return [stationInfo.longitude, stationInfo.latitude];
    },
    onClick: (info) =>
      trafficZone?.index !== info.index
        ? setTrafficZone(info)
        : setTrafficZone(null),
    onHover: (info) => setHoverInfo({ type: "traffic", info: info }),
    // FIXME: typings
    // @ts-ignore
    getColorValue: (stations: StationTraffic[]) =>
      stations.reduce(
        (sum: number, station: StationTraffic) =>
          (sum += station._count.arrivals + station._count.departures),
        0
      ) / stations.length,
    // @ts-ignore
    getElevationValue: (stations: StationTraffic[]) =>
      stations.reduce(
        (sum: number, station) =>
          (sum += station._count.arrivals + station._count.departures),
        0
      ),
  });

  return {
    trafficLayer,
  };
};

export default useTrafficLayers;
