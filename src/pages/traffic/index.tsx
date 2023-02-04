import Head from "next/head";
import Link from "next/link";
import { useAtom } from "jotai";
import { trafficZoneAtom } from "@hooks/MapLayers/useTrafficLayers";
import type { NextPage } from "next";
import type { StationTraffic } from "customTypes";

import SidePanel from "@components/SidePanel";
import {
  ArrivalsIcon,
  BikeIcon,
  CloseIcon,
  DeparturesIcon,
} from "@components/Icons";
import useZoneInfo from "@hooks/useZoneInfo";

const Station: NextPage = () => {
  const [, setTrafficZone] = useAtom(trafficZoneAtom);
  const { zoneStations, zoneTotals } = useZoneInfo();

  return (
    <>
      <Head>
        <title>Traffic</title>
      </Head>
      {zoneStations && (
        <SidePanel width="wide">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl">Area details</h2>
            <button
              className="group flex items-center"
              onClick={() => setTrafficZone(null)}
            >
              <span className="group-link mr-2 text-sm">Close</span>
              <CloseIcon width={20} className=" text-yellow-500" />
            </button>
          </div>

          <div className="mb-4 flex items-center">
            <BikeIcon width={24} className="mr-2 text-yellow-500" />
            <p>Total capacity {zoneTotals.capacity} bikes</p>
          </div>

          <div className="flex items-center justify-around border-t border-b border-cyan-800 bg-gradient-to-r from-transparent via-cyan-700/10 to-transparent py-3 text-sm">
            <div className="flex">
              <ArrivalsIcon width={22} className="mr-3 text-yellow-500" />
              <p>{zoneTotals.arrivals} arrivals</p>
            </div>
            <div className="flex">
              <DeparturesIcon width={22} className="mr-3 text-yellow-500" />
              <p>{zoneTotals.departures} departures</p>
            </div>
          </div>

          <h2 className="mt-6 mb-2 text-lg text-slate-400">
            Stations in the area
          </h2>

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
              {zoneStations?.map((station: StationTraffic) => (
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
