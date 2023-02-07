import React from "react";
import { useAtom } from "jotai";
import { formatDistance, formatDateTime, formatDuration } from "@utils/general";
import { mapHoverAtom } from "@components/Map/Map";
import type { Journey } from "@prisma/client";

const JourneyRow: React.FC<{ journey: Omit<Journey, "returnTime"> }> = ({
  journey,
}) => {
  const { id, departureTime, duration, distance } = journey;

  const [, setHoverId] = useAtom(mapHoverAtom);

  return (
    <tr
      onMouseEnter={() => setHoverId(id)}
      onMouseLeave={() => setHoverId(null)}
      className="hover:cursor-pointer hover:bg-yellow-500/20"
    >
      <td className="whitespace-nowrap">
        <span>{formatDateTime(departureTime)}</span>
      </td>
      <td className="w-2/3 text-right">
        <span>{formatDuration(duration)}</span>
      </td>
      <td className="w-1/3 text-right">
        <span>{formatDistance(distance)}</span>
      </td>
    </tr>
  );
};

export default JourneyRow;
