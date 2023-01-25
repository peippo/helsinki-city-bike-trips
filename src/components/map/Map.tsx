import { useAtom } from "jotai";
import { useRouter } from "next/router";
import DeckGL from "@deck.gl/react/typed";
import maplibregl from "maplibre-gl";
import { Map as ReactMapGl } from "react-map-gl";
import useMapViewState from "@hooks/useMapViewState";
import useAutoViewChange from "@hooks/useAutoViewChange";
import useMapLayers, { hoverInfoAtom } from "@hooks/useMapLayers";
import { mapStyle } from "@styles/map-style";
import type { IconLayer, ArcLayer } from "@deck.gl/layers/typed";
import type { HexagonLayer } from "@deck.gl/aggregation-layers/typed";
import "maplibre-gl/dist/maplibre-gl.css";

import Tooltip from "./Tooltip";

const Map = () => {
  const { stationsLayer, destinationsLayer, trafficLayer } = useMapLayers();
  const { viewState, handleViewStateChange } = useMapViewState();
  const [hoverInfo] = useAtom(hoverInfoAtom);
  const router = useRouter();
  useAutoViewChange();

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
        <ReactMapGl mapStyle={mapStyle} mapLib={maplibregl} />
        {hoverInfo?.object && <Tooltip hoverInfo={hoverInfo} />}
      </DeckGL>
    </>
  );
};

export default Map;
