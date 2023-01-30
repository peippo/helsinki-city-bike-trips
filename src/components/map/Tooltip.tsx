import { formatDistance, formatDuration } from "@utils/general";
import type { AggregationSource, TooltipTypes } from "customTypes";
import type { PickingInfo } from "@deck.gl/core/src/lib/picking/pick-info";

import {
  BikeIcon,
  ForwardIcon,
  ArrivalsIcon,
  DeparturesIcon,
  DistanceIcon,
  DurationIcon,
} from "../icons/Icons";

const Tooltip: React.FC<{
  type: TooltipTypes;
  info: PickingInfo;
}> = ({ type, info }) => {
  const totalArrivals = info.object?.points?.reduce(
    (sum: number, point: AggregationSource) =>
      (sum += point.source._count.arrivals),
    0
  );

  const totalDepartures = info.object?.points?.reduce(
    (sum: number, point: AggregationSource) =>
      (sum += point.source._count.departures),
    0
  );

  return (
    <div
      className="z-1 pointer-events-none absolute -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-lg border-b-2 border-slate-900 bg-sky-800 px-3 py-2 text-center text-slate-300 shadow-lg"
      style={{
        left: info.x,
        top: info.y,
      }}
    >
      {type === "station" && (
        <>
          <h2 className="text-yellow-300">{info.object.name}</h2>
          <p className="m-0 flex items-center justify-center uppercase">
            <span className="sr-only">Capacity: </span>
            <strong>{info.object.capacity}</strong>
            <BikeIcon width={24} className="ml-2" />{" "}
          </p>
        </>
      )}
      {type === "journey" && (
        <>
          <div className="flex items-center gap-2 text-sm">
            <span>{info.object.departure.name}</span>
            <ForwardIcon width={15} className="text-yellow-500" />
            <span>{info.object.arrival.name}</span>
          </div>
        </>
      )}
      {type === "journey-details" && (
        <>
          <div className="flex flex-col items-center gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span>{info.object.departureStation.name}</span>
              <ForwardIcon width={15} className="text-yellow-500" />
              <span>{info.object.arrivalStation.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <DistanceIcon width={18} className="mr-2 text-yellow-500" />
                <span>{formatDistance(info.object.distance)}</span>
              </div>
              <div className="flex items-center">
                <DurationIcon width={18} className="mr-2 text-yellow-500" />
                <span>{formatDuration(info.object.duration)}</span>
              </div>
            </div>
          </div>
        </>
      )}
      {type === "traffic" && (
        <>
          <div className="flex flex-col items-center gap-2 text-sm">
            <div className="flex flex-col gap-1">
              <h2 className="text-yellow-300">
                <span>{info.object.points.length}</span>{" "}
                {info.object.points.length === 1
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
