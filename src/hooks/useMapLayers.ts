import { trpc } from "@utils/trpc";
import { atom, useAtom } from "jotai";
import { IconLayer, ArcLayer } from "@deck.gl/layers/typed";
import { HexagonLayer } from "@deck.gl/aggregation-layers/typed";
import useSingleStation from "@hooks/useSingleStation";
import { useRouter } from "next/router";
import { STATION } from "@constants/index";
import type { StationPoint } from "customTypes";
import type { PickingInfo } from "@deck.gl/core/src/lib/picking/pick-info";
import { trafficModeAtom } from "@pages/stations/[stationId]";

export const hoverInfoAtom = atom<PickingInfo | undefined>(undefined);
export const trafficZoneAtom = atom<PickingInfo | undefined>(undefined);

const useMapLayers = () => {
  const stations = trpc.station.getAll.useQuery();
  const { selectedStation, trafficData } = useSingleStation();
  const [, setHoverInfo] = useAtom(hoverInfoAtom);
  const [, setTrafficZone] = useAtom(trafficZoneAtom);
  const [trafficMode] = useAtom(trafficModeAtom);
  const router = useRouter();

  const stationsData: StationPoint[] | undefined = stations.data?.map((s) => {
    return {
      type: STATION,
      coordinates: [s.longitude, s.latitude],
      capacity: s.capacity,
      name: s.name,
      stationId: s.stationId,
      departures: s._count.departures,
      arrivals: s._count.arrivals,
    };
  });

  const stationsLayer = new IconLayer({
    id: "stations-icon-layer",
    data: stationsData,
    pickable: true,
    iconAtlas: "/marker-atlas.png",
    iconMapping: "/marker-atlas-mapping.json",
    sizeScale: 1,
    sizeMinPixels: 20,
    autoHighlight: true,
    getPosition: (d) => d.coordinates,
    getIcon: (d) => {
      if (d.stationId === selectedStation.data?.stationId) {
        return "selectedStation";
      } else if (
        trafficData[trafficMode]?.some(
          (destination) => destination?.arrival.stationId === d.stationId
        )
      ) {
        return "departureStation";
      } else if (
        trafficData[trafficMode]?.some(
          (destination) => destination?.departure.stationId === d.stationId
        )
      ) {
        return "arrivalStation";
      } else {
        return "station";
      }
    },
    getSize: (d) => d.capacity,
    onHover: (info) => setHoverInfo(info as PickingInfo),
    onClick: (info) => {
      router.push(`/stations/${info.object.stationId}`);
    },
  });

  const destinationsLayer = new ArcLayer({
    id: "arc-layer",
    data: trafficData[trafficMode],
    pickable: true,
    getWidth: 5,
    getPolygonOffset: () => [200, 0],
    getSourcePosition: (d) => d.departure.coordinates,
    getTargetPosition: (d) => d.arrival.coordinates,
    getSourceColor: () => [50, 140, 255],
    getTargetColor: () => [200, 140, 255],
    onHover: (info) => setHoverInfo(info as PickingInfo),
  });

  const trafficLayer = new HexagonLayer({
    id: "hexagon-layer",
    data: stationsData,
    radius: 500,
    colorAggregation: "SUM",
    extruded: true,
    pickable: true,
    elevationRange: [0, 800],
    elevationScale: 5,
    opacity: 0.75,
    colorRange: [
      [236, 112, 20],
      [254, 153, 41],
      [250, 204, 21],
      [254, 227, 145],
      [255, 247, 188],
    ],
    autoHighlight: true,
    getColorWeight: (point) => point.arrivals + point.departures,
    getPosition: (d) => d.coordinates,
    onClick: (info) => {
      setTrafficZone(info as PickingInfo);
    },
    onHover: (info) => setHoverInfo(info as PickingInfo),
    // FIXME: typings
    getColorValue: (points) =>
      points.reduce(
        (sum: number, p: StationPoint) => (sum += p.arrivals + p.departures),
        0
      ) / points.length,
    getElevationValue: (points) =>
      points.reduce(
        (sum: number, p: StationPoint) => (sum += p.arrivals + p.departures),
        0
      ),
  });

  return { stationsLayer, destinationsLayer, trafficLayer };
};

export default useMapLayers;
