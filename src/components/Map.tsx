import { useState } from "react";
import { trpc } from "@utils/trpc";
import { useRouter } from "next/router";
import DeckGL from "@deck.gl/react/typed";
import { IconLayer } from "@deck.gl/layers/typed";
import maplibregl from "maplibre-gl";
import { Map as ReactMapGl } from "react-map-gl";
import type { PickingInfo } from "@deck.gl/core/src/lib/picking/pick-info";

import "maplibre-gl/dist/maplibre-gl.css";
import { mapStyle } from "@styles/map-style";

import BikeIcon from "./icons/BikeIcon";

const INITIAL_VIEW_STATE = {
  longitude: 24.9235379,
  latitude: 60.17061,
  zoom: 12,
  pitch: 50,
  bearing: 0,
};

const Map = () => {
  const stations = trpc.station.getAll.useQuery();
  const [hoverInfo, setHoverInfo] = useState<PickingInfo>();
  const router = useRouter();

  const data = stations.data?.map((s) => {
    return {
      coordinates: [s.longitude, s.latitude],
      capacity: s.capacity,
      name: s.name,
      stationId: s.stationId,
    };
  });

  const stationsIconLayer = new IconLayer({
    id: "stations-icon-layer",
    data: data,
    pickable: true,
    iconAtlas: "/marker-atlas.png",
    iconMapping: "/marker-atlas-mapping.json",
    sizeScale: 1,
    sizeMinPixels: 20,
    autoHighlight: true,
    getPosition: (d) => d.coordinates,
    getIcon: () => "station",
    getSize: (d) => d.capacity,
    onHover: (info) => setHoverInfo(info as PickingInfo),
    onClick: (info) => {
      router.push(`/stations/${info.object.stationId}`);
    },
  });

  return (
    <>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[stationsIconLayer]}
        getCursor={({ isHovering }) => (isHovering ? "pointer" : "grab")}
      >
        <ReactMapGl
          // @ts-ignore
          mapStyle={mapStyle}
          mapLib={maplibregl}
          initialViewState={INITIAL_VIEW_STATE}
        />
        {hoverInfo?.object && (
          <div
            className="z-1 pointer-events-none absolute -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-lg border-b-2 border-slate-900 bg-sky-800 px-3 py-2 text-center text-slate-300 shadow-lg"
            style={{
              left: hoverInfo.x,
              top: hoverInfo.y,
            }}
          >
            <h2 className="text-yellow-300">{hoverInfo.object.name}</h2>

            <p className="m-0 flex items-center justify-center uppercase">
              <span className="sr-only">Capacity: </span>
              <strong>{hoverInfo.object.capacity}</strong>
              <BikeIcon width={24} className="ml-2" />{" "}
            </p>
            <div className="absolute left-1/2 bottom-0 z-0 h-3 w-3 -translate-x-1/2 translate-y-1/2 rotate-45 transform border-r border-b border-slate-900 bg-sky-800"></div>
          </div>
        )}
      </DeckGL>
    </>
  );
};

export default Map;
