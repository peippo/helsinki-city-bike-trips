import React from "react";
import type { PickingInfo } from "@deck.gl/core/src/lib/picking/pick-info";
import { BikeIcon, ForwardIcon } from "./icons/Icons";

type Props = {
  hoverInfo: PickingInfo;
};

const Tooltip: React.FC<Props> = ({ hoverInfo }) => {
  return (
    <div
      className="z-1 pointer-events-none absolute -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-lg border-b-2 border-slate-900 bg-sky-800 px-3 py-2 text-center text-slate-300 shadow-lg"
      style={{
        left: hoverInfo.x,
        top: hoverInfo.y,
      }}
    >
      {hoverInfo.object.type === "station" && (
        <>
          <h2 className="text-yellow-300">{hoverInfo.object.name}</h2>

          <p className="m-0 flex items-center justify-center uppercase">
            <span className="sr-only">Capacity: </span>
            <strong>{hoverInfo.object.capacity}</strong>
            <BikeIcon width={24} className="ml-2" />{" "}
          </p>
        </>
      )}
      {hoverInfo.object.type === "destination" && (
        <>
          <div className="flex items-center gap-2 text-sm">
            <span>{hoverInfo.object.from.name}</span>
            <ForwardIcon width={15} className="text-yellow-500" />
            <span>{hoverInfo.object.to.name}</span>
          </div>
        </>
      )}
      <div className="absolute left-1/2 bottom-0 z-0 h-3 w-3 -translate-x-1/2 translate-y-1/2 rotate-45 transform border-r border-b border-slate-900 bg-sky-800"></div>
    </div>
  );
};

export default Tooltip;
