import React from "react";
import useCurrentMode from "@hooks/useMapMode";
import { STATION, TRAFFIC, DESTINATION } from "@constants/index";
import type { StationPoint } from "customTypes";
import type { PickingInfo } from "@deck.gl/core/src/lib/picking/pick-info";

import {
  BikeIcon,
  ForwardIcon,
  ArrivalsIcon,
  DeparturesIcon,
} from "./icons/Icons";

type TrafficSource = {
  source: StationPoint;
};

type Props = {
  hoverInfo: PickingInfo;
};

const Tooltip: React.FC<Props> = ({ hoverInfo }) => {
  const mode = useCurrentMode();

  const totalArrivals = hoverInfo.object?.points?.reduce(
    (sum: number, p: TrafficSource) => (sum += p.source.arrivals),
    0
  );

  const totalDepartures = hoverInfo.object?.points?.reduce(
    (sum: number, p: TrafficSource) => (sum += p.source.departures),
    0
  );

  const tooltipType = hoverInfo.object.type;
  const isStation = mode === STATION || tooltipType === STATION;
  const isDestination = mode === DESTINATION && tooltipType === DESTINATION;
  const isTraffic = mode === TRAFFIC;

  return (
    <div
      className="z-1 pointer-events-none absolute -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-lg border-b-2 border-slate-900 bg-sky-800 px-3 py-2 text-center text-slate-300 shadow-lg"
      style={{
        left: hoverInfo.x,
        top: hoverInfo.y,
      }}
    >
      {isStation && (
        <>
          <h2 className="text-yellow-300">{hoverInfo.object.name}</h2>
          <p className="m-0 flex items-center justify-center uppercase">
            <span className="sr-only">Capacity: </span>
            <strong>{hoverInfo.object.capacity}</strong>
            <BikeIcon width={24} className="ml-2" />{" "}
          </p>
        </>
      )}
      {isDestination && (
        <>
          <div className="flex items-center gap-2 text-sm">
            <span>{hoverInfo.object.from.name}</span>
            <ForwardIcon width={15} className="text-yellow-500" />
            <span>{hoverInfo.object.to.name}</span>
          </div>
        </>
      )}
      {isTraffic && (
        <>
          <div className="flex flex-col items-center gap-2 text-sm">
            <div className="flex flex-col gap-1">
              <h2 className="text-yellow-300">
                <span>{hoverInfo.object.points.length}</span>{" "}
                {hoverInfo.object.points.length === 1
                  ? `station in the area`
                  : `stations in the area`}
              </h2>
              <div className="flex justify-around gap-2">
                <div className="flex gap-2">
                  <ArrivalsIcon className="text-yellow-500" width={18} />
                  <span>{totalArrivals}</span>
                </div>
                <div className="flex gap-2">
                  <DeparturesIcon className="text-yellow-500" width={18} />
                  <span>{totalDepartures}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="absolute left-1/2 bottom-0 z-0 h-3 w-3 -translate-x-1/2 translate-y-1/2 rotate-45 transform border-r border-b border-slate-900 bg-sky-800"></div>
    </div>
  );
};

export default Tooltip;
