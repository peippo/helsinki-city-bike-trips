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
    let topDepartures: number[][] = [];

    const departures = selectedStation.data?.departures.reduce(
      (acc, departure) =>
        acc.set(
          departure.arrivalStationId,
          (acc.get(departure.arrivalStationId) || 0) + 1
        ),
      new Map()
    ) as Map<number, number>;

    topDepartures = Array.from(
      new Map([...departures.entries()].sort((a, b) => b[1] - a[1]))
    ).slice(0, 5);

    // Top arrival stations
    let topArrivals: number[][] = [];

    const arrivals = selectedStation.data?.arrivals.reduce(
      (acc, departure) =>
        acc.set(
          departure.departureStationId,
          (acc.get(departure.departureStationId) || 0) + 1
        ),
      new Map()
    ) as Map<number, number>;

    topArrivals = Array.from(
      new Map([...arrivals.entries()].sort((a, b) => b[1] - a[1]))
    ).slice(0, 5);

    return {
      arrival: topArrivals.map(([id, tripCount]) => {
        if (!stations.data || !selectedStation.data || !tripCount) return;

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
          tripCount: tripCount,
          percentage: getPercent(
            tripCount,
            selectedStation.data.arrivals.length
          ),
        };
      }),
      departure: topDepartures.map(([id, tripCount]) => {
        if (!stations.data || !selectedStation.data || !tripCount) return;

        const destinationStation = stations.data.find(
          (station) => station.stationId === id
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
          tripCount: tripCount,
          percentage: getPercent(
            tripCount,
            selectedStation.data.departures.length
          ),
        };
      }),
    };
  }, [selectedStation.data, stations.data]);

  return { selectedStation, trafficData };
};

export default useSingleStation;
