import { useMemo } from "react";
import { useRouter } from "next/router";
import { trpc } from "@utils/trpc";
import { getPercent, getKilometers, getMinutes } from "@utils/general";
import type { Journey, Station } from "@prisma/client";
import type { JourneyData, TrafficData } from "customTypes";

/**
 * Fetch single station details and top 5 arrival/departure stations
 */
const useSingleStation = () => {
  const router = useRouter();
  const { stationId } = router.query;
  const { data: stations } = trpc.station.getAll.useQuery();
  const { data: selectedStation, status } = trpc.station.getSingle.useQuery(
    {
      stationId: parseInt(stationId as string),
    },
    { enabled: !!stationId }
  );

  const trafficData: TrafficData = useMemo(() => {
    if (!selectedStation) return {} as TrafficData;

    const stats = {
      arrival: {
        totalDistance: 0,
        totalDuration: 0,
      },
      departure: {
        totalDistance: 0,
        totalDuration: 0,
      },
    };

    const countJourneys = (
      type: "departure" | "arrival",
      stationList: Map<number, number>,
      journey: Journey
    ) => {
      const id =
        type === "departure" ? "arrivalStationId" : "departureStationId";

      stats[type].totalDistance = stats[type].totalDistance + journey.distance;
      stats[type].totalDuration = stats[type].totalDuration + journey.duration;

      return stationList.set(
        journey[id],
        (stationList.get(journey[id]) || 0) + 1
      );
    };

    const sortTopStations = (stations: Map<number, number>) =>
      Array.from(
        new Map([...stations.entries()].sort((a, b) => b[1] - a[1]))
      ).slice(0, 5);

    // Top departure stations
    const departures = selectedStation.departures.reduce(
      (stationList, departure) =>
        countJourneys("departure", stationList, departure),
      new Map()
    );

    const sortedDepartures = sortTopStations(departures);

    // Top arrival stations
    const arrivals = selectedStation.arrivals.reduce(
      (stationList, arrival) => countJourneys("arrival", stationList, arrival),
      new Map()
    );

    const sortedArrivals = sortTopStations(arrivals);

    return {
      arrival: {
        averages: {
          distance: getKilometers(
            stats.arrival.totalDistance,
            selectedStation.arrivals.length
          ),
          duration: getMinutes(
            stats.arrival.totalDuration,
            selectedStation.arrivals.length
          ),
        },
        stations: sortedArrivals.map(([id, journeyCount]) => {
          if (!stations || !selectedStation || !journeyCount) return;

          const arrivalStation = stations.find(
            (station) => station.stationId === id
          ) as Station;

          return {
            departure: {
              stationId: arrivalStation.stationId,
              name: arrivalStation.name,
              coordinates: [
                arrivalStation.longitude,
                arrivalStation.latitude,
                1,
              ],
            },
            arrival: {
              stationId: selectedStation.stationId,
              name: selectedStation.name,
              coordinates: [
                selectedStation.longitude,
                selectedStation.latitude,
                1,
              ],
            },
            journeyCount: journeyCount,
            journeyPercentage: getPercent(
              journeyCount,
              selectedStation.arrivals.length
            ),
          };
        }) as JourneyData[],
      },
      departure: {
        averages: {
          distance: getKilometers(
            stats.departure.totalDistance,
            selectedStation.departures.length
          ),
          duration: getMinutes(
            stats.departure.totalDuration,
            selectedStation.departures.length
          ),
        },
        stations: sortedDepartures.map(([stationId, journeyCount]) => {
          if (!stations || !selectedStation || !journeyCount) return;

          const destinationStation = stations.find(
            (station) => station.stationId === stationId
          ) as Station;

          return {
            departure: {
              stationId: selectedStation.stationId,
              name: selectedStation.name,
              coordinates: [
                selectedStation.longitude,
                selectedStation.latitude,
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
              selectedStation.departures.length
            ),
          };
        }) as JourneyData[],
      },
    };
  }, [selectedStation, stations]);

  return { selectedStation, trafficData, status };
};

export default useSingleStation;
