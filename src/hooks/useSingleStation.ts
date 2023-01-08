import { useRouter } from "next/router";
import { trpc } from "@utils/trpc";

const useSingleStation = () => {
  const router = useRouter();
  const { stationId } = router.query;

  const station = trpc.station.getSingle.useQuery(
    {
      stationId: parseInt(stationId as string),
    },
    { enabled: !!stationId }
  );

  let topDestinationsIds = [];

  if (station.data) {
    const destinations = station.data?.departures.reduce(
      (acc, departure) =>
        acc.set(
          departure.arrivalStationId,
          (acc.get(departure.arrivalStationId) || 0) + 1
        ),
      new Map()
    );

    topDestinationsIds = Array.from(
      new Map([...destinations.entries()].sort((a, b) => b[1] - a[1]))
    )
      .slice(0, 5)
      .map((t) => t[0]);
  }

  return { station, topDestinationsIds };
};

export default useSingleStation;
