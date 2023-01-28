import { trpc } from "@utils/trpc";
import { atom, useAtom } from "jotai";
import { IconLayer, ArcLayer } from "@deck.gl/layers/typed";
import { HexagonLayer } from "@deck.gl/aggregation-layers/typed";
import useSingleStation from "@hooks/useSingleStation";
import { useRouter } from "next/router";
import { trafficModeAtom } from "@pages/stations/[stationId]";
import type { StationData, TooltipTypes } from "customTypes";
import type { PickingInfo } from "@deck.gl/core/src/lib/picking/pick-info";

export const hoverInfoAtom = atom<{
  type: TooltipTypes;
  info: PickingInfo;
} | null>(null);
export const trafficZoneAtom = atom<PickingInfo | null>(null);
export const mapHoverAtom = atom<number | null>(null);

const useMapLayers = () => {
  const { data: stations } = trpc.station.getAll.useQuery();
  const { selectedStation, trafficData } = useSingleStation();
  const [, setHoverInfo] = useAtom(hoverInfoAtom);
  const [trafficZone, setTrafficZone] = useAtom(trafficZoneAtom);
  const [trafficMode] = useAtom(trafficModeAtom);
  const [hoverId, setHoverId] = useAtom(mapHoverAtom);
  const router = useRouter();

  const stationsLayer = new IconLayer({
    id: "stations-icon-layer",
    data: stations,
    pickable: true,
    iconAtlas: "/marker-atlas.png",
    iconMapping: "/marker-atlas-mapping.json",
    sizeScale: 1,
    sizeMinPixels: 20,
    autoHighlight: true,
    highlightedObjectIndex: stations?.findIndex(
      (station) => station.stationId === hoverId
    ),
    updateTriggers: {
      getIcon: selectedStation && trafficMode,
    },
    getPosition: (station: StationData) => [
      station.longitude,
      station.latitude,
    ],
    getIcon: (station: StationData) => {
      if (selectedStation) {
        if (station.stationId === selectedStation.stationId) {
          return "selectedStation";
        } else if (
          selectedStation &&
          trafficData[trafficMode].stations.some(
            (destination) => destination.arrival.stationId === station.stationId
          )
        ) {
          return "departureStation";
        } else if (
          selectedStation &&
          trafficData[trafficMode].stations.some(
            (destination) =>
              destination.departure.stationId === station.stationId
          )
        ) {
          return "arrivalStation";
        }
      }

      return "station";
    },
    getSize: (station: StationData) => station.capacity,
    onHover: (info) => {
      setHoverInfo({ type: "station", info: info as PickingInfo });
      setHoverId(info.object ? info.object?.stationId : null);
    },
    onClick: (info) => {
      router.push(`/stations/${info.object.stationId}`);
    },
  });

  const topJourneysLayer = new ArcLayer({
    id: "arc-layer",
    data: trafficData[trafficMode]?.stations,
    pickable: true,
    getWidth: 5,
    getPolygonOffset: () => [200, 0],
    getSourcePosition: (d) => d.departure.coordinates,
    getTargetPosition: (d) => d.arrival.coordinates,
    getSourceColor: () => [50, 140, 255],
    getTargetColor: () => [200, 140, 255],
    onHover: (info) =>
      setHoverInfo({ type: "journey", info: info as PickingInfo }),
  });

  const trafficLayer = new HexagonLayer({
    id: "hexagon-layer",
    data: stations,
    radius: 500,
    coverage: 0.9,
    colorAggregation: "SUM",
    colorScaleType: "quantile",
    extruded: true,
    pickable: true,
    elevationRange: [0, 1200],
    elevationScale: 5,
    opacity: 0.75,
    highlightColor: [240, 204, 21],
    highlightedObjectIndex: trafficZone ? trafficZone.index : -1,
    colorRange: [
      [22, 90, 205],
      [45, 120, 205],
      [122, 120, 225],
      [178, 140, 235],
      [248, 170, 255],
    ],
    autoHighlight: true,
    getColorWeight: (station) =>
      station._count.arrivals + station._count.departures,
    getPosition: (station) => [station.longitude, station.latitude],
    onClick: (info) =>
      trafficZone?.index !== info.index
        ? setTrafficZone(info as PickingInfo)
        : setTrafficZone(null),
    onHover: (info) =>
      setHoverInfo({ type: "traffic", info: info as PickingInfo }),
    // FIXME: typings
    getColorValue: (points: StationData[]) =>
      points.reduce(
        (sum: number, p: StationData) =>
          (sum += p._count.arrivals + p._count.departures),
        0
      ) / points.length,
    getElevationValue: (points: StationData[]) =>
      points.reduce(
        (sum: number, p: StationData) =>
          (sum += p._count.arrivals + p._count.departures),
        0
      ),
  });

  return { stationsLayer, topJourneysLayer, trafficLayer };
};

export default useMapLayers;
