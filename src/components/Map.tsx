import { useEffect, useState } from "react";
import { trpc } from "@utils/trpc";
import { useRouter } from "next/router";
import DeckGL from "@deck.gl/react/typed";
import { IconLayer, ArcLayer } from "@deck.gl/layers/typed";
import maplibregl from "maplibre-gl";
import { Map as ReactMapGl } from "react-map-gl";
import useSingleStation from "@hooks/useSingleStation";
import type { PickingInfo } from "@deck.gl/core/src/lib/picking/pick-info";

import "maplibre-gl/dist/maplibre-gl.css";
import { mapStyle } from "@styles/map-style";

import Tooltip from "./Tooltip";
import useMapViewState from "@hooks/useMapViewState";

const Map = () => {
  const stations = trpc.station.getAll.useQuery();
  const { selectedStation, destinationsData } = useSingleStation();
  const { viewState, handleViewStateChange } = useMapViewState(
    selectedStation.data
  );

  const [hoverInfo, setHoverInfo] = useState<PickingInfo>();
  const router = useRouter();

  const stationsData = stations.data?.map((s) => {
    return {
      type: "station",
      coordinates: [s.longitude, s.latitude],
      capacity: s.capacity,
      name: s.name,
      stationId: s.stationId,
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
    autoHighlight: true,
    getPolygonOffset: () => [200, 0],
    getSourcePosition: (d) => d.from.coordinates,
    getTargetPosition: (d) => d.to.coordinates,
    getSourceColor: () => [50, 140, 255],
    getTargetColor: () => [200, 140, 255],
    onHover: (info) => setHoverInfo(info as PickingInfo),
  });

  return (
    <>
      <DeckGL
        viewState={viewState}
        onViewStateChange={handleViewStateChange}
        controller={true}
        layers={[destinationsLayer, stationsLayer]}
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
