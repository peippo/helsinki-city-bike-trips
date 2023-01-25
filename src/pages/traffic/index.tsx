import { type NextPage } from "next";
import Head from "next/head";
import { useAtom } from "jotai";
import { trafficZoneAtom } from "@hooks/useMapLayers";

import SidePanel from "@components/SidePanel";
import Link from "next/link";
import {
  ArrivalsIcon,
  CloseIcon,
  DeparturesIcon,
} from "@components/icons/Icons";
import type { StationPoint } from "customTypes";

const Station: NextPage = () => {
  const [trafficZone, setTrafficZone] = useAtom(trafficZoneAtom);
  const zoneStations: StationPoint[] = trafficZone?.object.points.map(
    (z: any) => z.source
  );

  zoneStations?.sort(
    (a: StationPoint, b: StationPoint) =>
      b.arrivals + b.departures - (a.arrivals + a.departures)
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
                <th>Station name</th>
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
              {zoneStations?.map((station: StationPoint) => (
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
                    <span className="text-sm">{station.arrivals}</span>
                  </td>
                  <td className="text-center">
                    <span className="text-sm">{station.departures}</span>
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
