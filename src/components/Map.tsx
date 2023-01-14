import { useState } from "react";
import { trpc } from "@utils/trpc";
import { useRouter } from "next/router";
import DeckGL from "@deck.gl/react/typed";
import { IconLayer, ArcLayer } from "@deck.gl/layers/typed";
import { HexagonLayer } from "@deck.gl/aggregation-layers/typed";
import maplibregl from "maplibre-gl";
import { Map as ReactMapGl } from "react-map-gl";
import useSingleStation from "@hooks/useSingleStation";
import useMapViewState from "@hooks/useMapViewState";
import useAutoViewChange from "@hooks/useAutoViewChange";
import { STATION } from "@constants/index";
import { mapStyle } from "@styles/map-style";
import type { PickingInfo } from "@deck.gl/core/src/lib/picking/pick-info";
import type { StationPoint } from "customTypes";
import "maplibre-gl/dist/maplibre-gl.css";

import Tooltip from "./Tooltip";

const Map = () => {
  const stations = trpc.station.getAll.useQuery();
  const [hoverInfo, setHoverInfo] = useState<PickingInfo>();
  const { selectedStation, destinationsData } = useSingleStation();
  const { viewState, handleViewStateChange } = useMapViewState();
  const router = useRouter();
  useAutoViewChange();

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
        destinationsData.some(
          (destination) => destination?.to.stationId === d.stationId
        )
      ) {
        return "destinationStation";
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
    data: destinationsData,
    pickable: true,
    getWidth: 5,
    getPolygonOffset: () => [200, 0],
    getSourcePosition: (d) => d.from.coordinates,
    getTargetPosition: (d) => d.to.coordinates,
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
    onHover: (info) => setHoverInfo(info as PickingInfo),
    // FIXME: typings
    // @ts-ignore
    getColorValue: (points) =>
      points.reduce(
        (sum: number, p: StationPoint) => (sum += p.arrivals + p.departures),
        0
      ) / points.length,
    // @ts-ignore
    getElevationValue: (points) =>
      points.reduce(
        (sum: number, p: StationPoint) => (sum += p.arrivals + p.departures),
        0
      ),
  });

  let activeLayers: Array<IconLayer | ArcLayer | HexagonLayer> = [];

  switch (router.pathname) {
    case "/stations/[stationId]":
      activeLayers = [stationsLayer, destinationsLayer];
      break;
    case "/traffic":
      activeLayers = [trafficLayer];
      break;
    default:
      activeLayers = [stationsLayer];
      break;
  }

  return (
    <>
      <DeckGL
        viewState={viewState}
        onViewStateChange={handleViewStateChange}
        controller={true}
        layers={activeLayers}
        getCursor={({ isHovering }) => (isHovering ? "pointer" : "grab")}
      >
        <ReactMapGl
          // @ts-ignore
          mapStyle={mapStyle}
          mapLib={maplibregl}
        />
        {hoverInfo?.object && <Tooltip hoverInfo={hoverInfo} />}
      </DeckGL>
    </>
  );
};

export default Map;
