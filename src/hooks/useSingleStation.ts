import { useMemo } from "react";
import { useRouter } from "next/router";
import { trpc } from "@utils/trpc";
import { getPercent } from "@utils/general";
import { DESTINATION } from "@constants/index";
import type { Station } from "@prisma/client";
import type { DestinationPoint } from "customTypes";

/**
 * Fetch single station details and top 5 departure destinations
 */
const useSingleStation = () => {
  const router = useRouter();
  const { stationId } = router.query;
  const stations = trpc.station.getAll.useQuery();
  const selectedStation = trpc.station.getSingle.useQuery(
    {
      stationId: parseInt(stationId as string),
    },
    { enabled: !!stationId }
  );

  const destinationsData: Array<DestinationPoint | undefined> = useMemo(() => {
    if (!selectedStation.data) return [];

    let topDestinations: number[][] = [];

    const destinations = selectedStation.data?.departures.reduce(
      (acc, departure) =>
        acc.set(
          departure.arrivalStationId,
          (acc.get(departure.arrivalStationId) || 0) + 1
        ),
      new Map()
    ) as Map<number, number>;

    topDestinations = Array.from(
      new Map([...destinations.entries()].sort((a, b) => b[1] - a[1]))
    ).slice(0, 5);

    return topDestinations.map(([id, tripCount]) => {
      if (!stations.data || !selectedStation.data || !tripCount) return;

      const destinationStation = stations.data.find(
        (station) => station.stationId === id
      ) as Station;

      return {
        type: DESTINATION,
        from: {
          name: selectedStation.data.name,
          coordinates: [
            selectedStation.data.longitude,
            selectedStation.data.latitude,
            1,
          ],
        },
        to: {
          stationId: destinationStation.stationId,
          name: destinationStation.name,
          coordinates: [
            destinationStation.longitude,
            destinationStation.latitude,
            1,
          ],
          tripCount: tripCount,
          percentage: getPercent(
            tripCount,
            selectedStation.data.departures.length
          ),
        },
      };
    });
  }, [selectedStation.data, stations.data]);

  return { selectedStation, destinationsData };
};

export default useSingleStation;
