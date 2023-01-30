import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useAtom } from "jotai";
import { trafficZoneAtom } from "@hooks/useMapLayers";
import type { AggregationSource, StationData } from "customTypes";

import SidePanel from "@components/SidePanel";
import {
  ArrivalsIcon,
  CloseIcon,
  DeparturesIcon,
} from "@components/icons/Icons";

const Station: NextPage = () => {
  const [trafficZone, setTrafficZone] = useAtom(trafficZoneAtom);
  const zoneStations: StationData[] = trafficZone?.object.points.map(
    (z: AggregationSource) => z.source
  );

  zoneStations?.sort(
    (a: StationData, b: StationData) =>
      b._count.arrivals +
      b._count.departures -
      (a._count.arrivals + a._count.departures)
  );

  return (
    <>
      <Head>
        <title>Traffic</title>
      </Head>
      {zoneStations && (
        <SidePanel width="wide">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl">Stations in the area</h2>
            <button
              className="group flex items-center"
              onClick={() => setTrafficZone(null)}
            >
              <span className="group-link mr-2 text-sm">Close</span>
              <CloseIcon width={20} className=" text-yellow-500" />
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left text-yellow-400">
                <th className="text-sm lg:text-base">Station name</th>
                <th>
                  <span className="sr-only">Arrivals</span>
                  <ArrivalsIcon className="mx-auto" width={16} />
                </th>
                <th>
                  <span className="sr-only">Departures</span>
                  <DeparturesIcon className="mx-auto" width={16} />
                </th>
              </tr>
            </thead>
            <tbody>
              {zoneStations?.map((station: StationData) => (
                <tr key={station.stationId}>
                  <td>
                    <Link
                      href={`/stations/${station.stationId}`}
                      className="link"
                    >
                      <span>{station.name}</span>
                    </Link>
                  </td>
                  <td className="text-center">
                    <span className="text-sm">{station._count.arrivals}</span>
                  </td>
                  <td className="text-center">
                    <span className="text-sm">{station._count.departures}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SidePanel>
      )}
    </>
  );
};

export default Station;
