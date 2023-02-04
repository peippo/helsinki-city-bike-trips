import { trpc } from "@utils/trpc";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { IconLayer, ArcLayer } from "@deck.gl/layers/typed";
import { trafficModeAtom } from "@pages/stations/[stationId]";
import { hoverInfoAtom, mapHoverAtom } from "@components/Map/Map";
import useSingleStation from "@hooks/useSingleStation";
import type { Station } from "@prisma/client";
import type { JourneyData } from "customTypes";

const useStationsLayers = () => {
  const [, setHoverInfo] = useAtom(hoverInfoAtom);
  const [trafficMode] = useAtom(trafficModeAtom);
  const [hoverId, setHoverId] = useAtom(mapHoverAtom);
  const router = useRouter();
  const { data: stations } = trpc.station.getAll.useQuery();
  const { selectedStation, trafficData } = useSingleStation();

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
    getPosition: (station: Station) => [station.longitude, station.latitude],
    getIcon: (station: Station) => {
      if (selectedStation) {
        if (station.stationId === selectedStation.stationId) {
          return "selectedStation";
        } else if (
          trafficData[trafficMode].stations.some(
            (destination) => destination.arrival.stationId === station.stationId
          )
        ) {
          return "arrivalStation";
        } else if (
          trafficData[trafficMode].stations.some(
            (destination) =>
              destination.departure.stationId === station.stationId
          )
        ) {
          return "departureStation";
        }
      }

      return "station";
    },
    getSize: (station: Station) => station.capacity,
    onHover: (info) => {
      setHoverInfo({ type: "station", info: info });
      setHoverId(info.object ? info.object?.stationId : null);
    },
    onClick: (info) => {
      router.push(`/stations/${info.object.stationId}`);
    },
  });

  const topJourneysLayer = new ArcLayer({
    id: "top-journeys-layer",
    data: trafficData[trafficMode]?.stations,
    pickable: true,
    getWidth: 5,
    autoHighlight: true,
    highlightColor: [240, 204, 21],
    highlightedObjectIndex: trafficData[trafficMode]?.stations?.findIndex(
      (journey: JourneyData) =>
        journey.arrival.stationId === hoverId ||
        journey.departure.stationId === hoverId
    ),
    getPolygonOffset: () => [200, 0],
    getSourcePosition: (journey: JourneyData) => journey.departure.coordinates,
    getTargetPosition: (journey: JourneyData) => journey.arrival.coordinates,
    getSourceColor: () => [50, 140, 255],
    getTargetColor: () => [200, 140, 255],
    onHover: (info) => {
      setHoverInfo({ type: "journey", info: info });
      setHoverId(
        info?.object &&
          info.object[trafficMode === "arrival" ? "departure" : "arrival"]
            .stationId
      );
    },
  });

  return {
    stationsLayer,
    topJourneysLayer,
  };
};

export default useStationsLayers;
