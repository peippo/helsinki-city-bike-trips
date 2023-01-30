import { trpc } from "@utils/trpc";
import { atom, useAtom } from "jotai";
import { IconLayer, ArcLayer, LineLayer } from "@deck.gl/layers/typed";
import { HexagonLayer } from "@deck.gl/aggregation-layers/typed";
import useSingleStation from "@hooks/useSingleStation";
import { useRouter } from "next/router";
import { trafficModeAtom } from "@pages/stations/[stationId]";
import type { StationData, TooltipTypes } from "customTypes";
import type { PickingInfo } from "@deck.gl/core/src/lib/picking/pick-info";
import useJourneys from "./useJourneys";
import { currentPageAtom } from "@pages/journeys";

export const hoverInfoAtom = atom<{
  type: TooltipTypes;
  info: PickingInfo;
} | null>(null);
export const trafficZoneAtom = atom<PickingInfo | null>(null);
export const mapHoverAtom = atom<number | string | null>(null);

const useMapLayers = () => {
  const { data: stations } = trpc.station.getAll.useQuery();
  const { selectedStation, trafficData } = useSingleStation();
  const [currentPage] = useAtom(currentPageAtom);
  const { journeys } = useJourneys();
  const [hoverInfo, setHoverInfo] = useAtom(hoverInfoAtom);
  const [trafficZone, setTrafficZone] = useAtom(trafficZoneAtom);
  const [trafficMode] = useAtom(trafficModeAtom);
  const [hoverId, setHoverId] = useAtom(mapHoverAtom);
  const router = useRouter();

  const isJourneys = router.pathname.includes("journeys");
  const currentPageJourneys = journeys?.pages[currentPage]?.items;

  //////////////
  // Stations //
  //////////////

  const stationsLayer = new IconLayer({
    id: "stations-layer",
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
      getIcon: [selectedStation, trafficMode, router.pathname],
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
          return "arrivalStation";
        } else if (
          selectedStation &&
          trafficData[trafficMode].stations.some(
            (destination) =>
              destination.departure.stationId === station.stationId
          )
        ) {
          return "departureStation";
        }
      } else if (isJourneys) {
        return "stationDark";
      }

      return "station";
    },
    getSize: (station: StationData) => station.capacity,
    onHover: (info) => {
      setHoverInfo({ type: "station", info: info as PickingInfo });
      setHoverId(info.object ? info.object?.stationId : null);
    },
    onClick: (info) => {
      isJourneys
        ? setHoverId(info.object.stationId)
        : router.push(`/stations/${info.object.stationId}`);
    },
  });

  const topJourneysLayer = new ArcLayer({
    id: "top-journeys-layer",
    data: trafficData[trafficMode]?.stations,
    pickable: true,
    getWidth: 5,
    autoHighlight: true,
    highlightColor: [240, 204, 21],
    getPolygonOffset: () => [200, 0],
    getSourcePosition: (d) => d.departure.coordinates,
    getTargetPosition: (d) => d.arrival.coordinates,
    getSourceColor: () => [50, 140, 255],
    getTargetColor: () => [200, 140, 255],
    onHover: (info) =>
      setHoverInfo({ type: "journey", info: info as PickingInfo }),
  });

  /////////////
  // Traffic //
  /////////////

  const trafficLayer = new HexagonLayer({
    id: "traffic-layer",
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

  //////////////
  // Journeys //
  //////////////

  const journeysLayer = new ArcLayer({
    id: "journeys-layer",
    data: currentPageJourneys,
    pickable: true,
    autoHighlight: true,
    highlightColor: [240, 204, 21],
    highlightedObjectIndex: currentPageJourneys?.findIndex(
      (journey) => journey.id === hoverId
    ),
    updateTriggers: {
      getWidth: hoverId,
      getSourceColor: hoverId,
      getTargetColor: hoverId,
    },
    getWidth: () => 5,
    getSourcePosition: (d) => [
      d.departureStation.longitude,
      d.departureStation.latitude,
    ],
    getTargetPosition: (d) => [
      d.arrivalStation.longitude,
      d.arrivalStation.latitude,
    ],
    getSourceColor: () => [50, 140, 255],
    getTargetColor: () => [200, 140, 255],
    onHover: (info) => {
      setHoverInfo({ type: "journey-details", info: info as PickingInfo });
      setHoverId(info.object?.id);
    },
  });

  const journeysStationsLayer = new IconLayer({
    id: "journeys-stations-layer",
    data: stations,
    iconAtlas: "/marker-atlas.png",
    iconMapping: "/marker-atlas-mapping.json",
    sizeScale: 1,
    sizeMinPixels: 20,
    updateTriggers: {
      getIcon: [hoverInfo, hoverId],
    },
    getPosition: (station: StationData) => [
      station.longitude,
      station.latitude,
    ],
    getIcon: (station) => {
      const hoveredJourney = hoverInfo?.info?.object;

      const hoveredListJourney = currentPageJourneys?.find(
        (j) => j.id === hoverId
      );
      const hoveredListJourneyStationIds = {
        departureStationId: hoveredListJourney?.departureStationId,
        arrivalStationId: hoveredListJourney?.arrivalStationId,
      };

      if (
        station.stationId === hoveredJourney?.departureStationId ||
        station.stationId === hoveredListJourneyStationIds.departureStationId
      ) {
        return "departureStation";
      } else if (
        station.stationId === hoveredJourney?.arrivalStationId ||
        station.stationId === hoveredListJourneyStationIds.arrivalStationId
      ) {
        return "arrivalStation";
      } else {
        return "stationDark";
      }
    },
    getSize: (station: StationData) => station.capacity,
  });

  return {
    stationsLayer,
    topJourneysLayer,
    trafficLayer,
    journeysLayer,
    journeysStationsLayer,
  };
};

export default useMapLayers;
