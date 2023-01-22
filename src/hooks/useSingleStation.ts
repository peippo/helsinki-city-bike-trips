import { useMemo } from "react";
import { useRouter } from "next/router";
import { trpc } from "@utils/trpc";
import { getPercent, getKilometers, getMinutes } from "@utils/general";
import { DESTINATION } from "@constants/index";
import type { Journey, Station } from "@prisma/client";
import type { JourneyData, TrafficData } from "customTypes";

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

  const trafficData: TrafficData = useMemo(() => {
    if (!selectedStation.data) return {} as TrafficData;

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
    const departures = selectedStation.data.departures.reduce(
      (stationList, departure) =>
        countJourneys("departure", stationList, departure),
      new Map()
    );

    const sortedDepartures = sortTopStations(departures);

    // Top arrival stations
    const arrivals = selectedStation.data.arrivals.reduce(
      (stationList, arrival) => countJourneys("arrival", stationList, arrival),
      new Map()
    );

    const sortedArrivals = sortTopStations(arrivals);

    return {
      arrival: {
        averages: {
          distance: getKilometers(
            stats.arrival.totalDistance,
            selectedStation.data.arrivals.length
          ),
          duration: getMinutes(
            stats.arrival.totalDuration,
            selectedStation.data.arrivals.length
          ),
        },
        stations: sortedArrivals.map(([id, journeyCount]) => {
          if (!stations.data || !selectedStation.data || !journeyCount) return;

          const arrivalStation = stations.data.find(
            (station) => station.stationId === id
          ) as Station;

          return {
            type: DESTINATION,
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
        }) as JourneyData[],
      },
      departure: {
        averages: {
          distance: getKilometers(
            stats.departure.totalDistance,
            selectedStation.data.departures.length
          ),
          duration: getMinutes(
            stats.departure.totalDuration,
            selectedStation.data.departures.length
          ),
        },
        stations: sortedDepartures.map(([stationId, journeyCount]) => {
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
        }) as JourneyData[],
      },
    };
  }, [selectedStation.data, stations.data]);

  return { selectedStation, trafficData };
};

export default useSingleStation;
