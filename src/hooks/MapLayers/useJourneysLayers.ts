import { trpc } from "@utils/trpc";
import { useAtom } from "jotai";
import { IconLayer, ArcLayer } from "@deck.gl/layers/typed";
import { currentPageAtom } from "@pages/journeys";
import { hoverInfoAtom, mapHoverAtom } from "@components/Map/Map";
import useJourneys from "@hooks/useJourneys";
import type { Station } from "@prisma/client";

const useJourneysLayers = () => {
  const [currentPage] = useAtom(currentPageAtom);
  const [hoverInfo, setHoverInfo] = useAtom(hoverInfoAtom);
  const [hoverId, setHoverId] = useAtom(mapHoverAtom);
  const { data: stations } = trpc.station.getAll.useQuery();
  const { journeys } = useJourneys();

  const currentPageJourneys = journeys?.pages[currentPage]?.items;

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
      setHoverInfo({ type: "journey-details", info: info });
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
    getPosition: (station: Station) => [station.longitude, station.latitude],
    getSize: (station: Station) => station.capacity,
    getIcon: (station) => {
      const { stationId } = station;
      const hoveredJourney = hoverInfo?.info?.object;
      const hoveredListJourney = currentPageJourneys?.find(
        (journey) => journey.id === hoverId
      );

      const isDepartureStation =
        stationId === hoveredJourney?.departureStationId ||
        stationId === hoveredListJourney?.departureStationId;

      const isArrivalStation =
        stationId === hoveredJourney?.arrivalStationId ||
        stationId === hoveredListJourney?.arrivalStationId;

      if (isDepartureStation) {
        return "departureStation";
      }

      if (isArrivalStation) {
        return "arrivalStation";
      }

      return "stationDark";
    },
  });

  return {
    journeysLayer,
    journeysStationsLayer,
  };
};

export default useJourneysLayers;
