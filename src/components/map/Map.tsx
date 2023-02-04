import DeckGL from "@deck.gl/react/typed";
import maplibregl from "maplibre-gl";
import useMapViewState from "@hooks/useMapViewState";
import useAutoViewChange from "@hooks/useAutoViewChange";
import useJourneysLayers from "@hooks/MapLayers/useJourneysLayers";
import useTrafficLayers from "@hooks/MapLayers/useTrafficLayers";
import useStationsLayers from "@hooks/MapLayers/useStationsLayers";
import { Map as ReactMapGl } from "react-map-gl";
import { atom, useAtom } from "jotai";
import { useRouter } from "next/router";
import { mapStyle } from "@styles/map-style";
import { mapEffects } from "./mapEffects";
import type { IconLayer, ArcLayer, LineLayer } from "@deck.gl/layers/typed";
import type { HexagonLayer } from "@deck.gl/aggregation-layers/typed";
import type { PickingInfo } from "@deck.gl/core/typed";
import type { TooltipTypes } from "customTypes";
import "maplibre-gl/dist/maplibre-gl.css";

import Tooltip from "@components/Map/Tooltip";

export const hoverInfoAtom = atom<{
  type: TooltipTypes;
  info: PickingInfo;
} | null>(null);
export const mapHoverAtom = atom<number | string | null>(null);

const Map = () => {
  const { journeysLayer, journeysStationsLayer } = useJourneysLayers();
  const { stationsLayer, topJourneysLayer } = useStationsLayers();
  const { trafficLayer } = useTrafficLayers();
  const { viewState, handleViewStateChange } = useMapViewState();
  const [hoverInfo] = useAtom(hoverInfoAtom);
  const router = useRouter();
  useAutoViewChange();

  let activeLayers: Array<IconLayer | ArcLayer | HexagonLayer | LineLayer> = [];

  switch (router.pathname) {
    case "/stations/[stationId]":
      activeLayers = [stationsLayer, topJourneysLayer];
      break;
    case "/traffic":
      activeLayers = [trafficLayer];
      break;
    case "/journeys":
      activeLayers = [journeysLayer, journeysStationsLayer];
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
        effects={mapEffects}
      >
        {/* @ts-ignore */}
        <ReactMapGl mapStyle={mapStyle} mapLib={maplibregl} />
        {hoverInfo?.info.object && (
          <Tooltip type={hoverInfo.type} info={hoverInfo.info} />
        )}
      </DeckGL>
    </>
  );
};

export default Map;
