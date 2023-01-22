import { useMemo } from "react";
import { useRouter } from "next/router";
import { trpc } from "@utils/trpc";
import { getPercent } from "@utils/general";
import { DESTINATION } from "@constants/index";
import type { Station } from "@prisma/client";
import type { TrafficData } from "customTypes";

/**
 * Fetch single station details and top 5 arrival/departure stations
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

  // FIXME: repetition

  const trafficData: TrafficData = useMemo(() => {
    if (!selectedStation.data) return { arrival: [], departure: [] };

    // Top departure stations
    const departureCounts = selectedStation.data.departures.reduce(
      (stationList, departure) =>
        stationList.set(
          departure.arrivalStationId,
          (stationList.get(departure.arrivalStationId) || 0) + 1
        ),
      new Map()
    );

    const sortedDepartures = Array.from(
      new Map([...departureCounts.entries()].sort((a, b) => b[1] - a[1]))
    ).slice(0, 5);

    // Top arrival stations
    const arrivals = selectedStation.data.arrivals.reduce(
      (stationList, arrival) =>
        stationList.set(
          arrival.departureStationId,
          (stationList.get(arrival.departureStationId) || 0) + 1
        ),
      new Map()
    );

    const sortedArrivals = Array.from(
      new Map([...arrivals.entries()].sort((a, b) => b[1] - a[1]))
    ).slice(0, 5);

    return {
      arrival: sortedArrivals.map(([id, journeyCount]) => {
        if (!stations.data || !selectedStation.data || !journeyCount) return;

        const arrivalStation = stations.data.find(
          (station) => station.stationId === id
        ) as Station;

        return {
          type: DESTINATION,
          departure: {
            stationId: arrivalStation.stationId,
            name: arrivalStation.name,
            coordinates: [arrivalStation.longitude, arrivalStation.latitude, 1],
          },
          arrival: {
            stationId: selectedStation.data.stationId,
            name: selectedStation.data.name,
            coordinates: [
              selectedStation.data.longitude,
              selectedStation.data.latitude,
              1,
            ],
          },
          journeyCount: journeyCount,
          journeyPercentage: getPercent(
            journeyCount,
            selectedStation.data.arrivals.length
          ),
        };
      }),
      departure: sortedDepartures.map(([stationId, journeyCount]) => {
        if (!stations.data || !selectedStation.data || !journeyCount) return;

        const destinationStation = stations.data.find(
          (station) => station.stationId === stationId
        ) as Station;

        return {
          type: DESTINATION,
          departure: {
            stationId: selectedStation.data.stationId,
            name: selectedStation.data.name,
            coordinates: [
              selectedStation.data.longitude,
              selectedStation.data.latitude,
              1,
            ],
          },
          arrival: {
            stationId: destinationStation.stationId,
            name: destinationStation.name,
            coordinates: [
              destinationStation.longitude,
              destinationStation.latitude,
              1,
            ],
          },
          journeyCount: journeyCount,
          journeyPercentage: getPercent(
            journeyCount,
            selectedStation.data.departures.length
          ),
        };
      }),
    };
  }, [selectedStation.data, stations.data]);

  return { selectedStation, trafficData };
};

export default useSingleStation;
