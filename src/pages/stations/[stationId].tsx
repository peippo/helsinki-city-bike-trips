import { type NextPage } from "next";
import Head from "next/head";

import SidePanel from "@components/SidePanel";
import {
  ArrivalsIcon,
  BackIcon,
  BikeIcon,
  DeparturesIcon,
} from "@components/icons/Icons";
import Link from "next/link";
import useSingleStation from "@hooks/useSingleStation";

const Station: NextPage = () => {
  const { selectedStation, destinationsData } = useSingleStation();

  return (
    <>
      <Head>
        <title>
          {selectedStation.data
            ? `${selectedStation.data.name} [${selectedStation.data.stationId}]`
            : "Loading..."}
        </title>
      </Head>
      <SidePanel width="wide">
        <Link className="group mb-3 inline-flex items-center" href="/">
          <BackIcon width={12} className="mr-2 text-yellow-500" />
          <span className="group-link">All stations</span>
        </Link>
        {selectedStation.data && (
          <div className="flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl">{selectedStation.data.name}</h2>
                <span className="text-sm text-slate-400">
                  {selectedStation.data.address}
                </span>
              </div>
              <div className="align-center flex aspect-square items-center justify-center rounded-full border-l bg-yellow-400 px-3 text-slate-900">
                <span className="sr-only">Station ID: </span>
                <span>{selectedStation.data.stationId}</span>
              </div>
            </div>
            <div className="mb-4 flex items-center">
              <BikeIcon width={24} className="mr-2 text-yellow-500" />
              <p>Capacity {selectedStation.data.capacity} bikes</p>
            </div>
            <div className="flex items-center justify-center border-t border-b border-cyan-800">
              <div className="flex flex-grow justify-center px-2 py-3">
                <ArrivalsIcon width={22} className="mr-3 text-yellow-500" />
                <p>{selectedStation.data.arrivals.length} arrivals</p>
              </div>
              <div className="flex flex-grow items-center justify-center border-l border-cyan-800 px-2 py-3">
                <DeparturesIcon width={22} className="mr-3 text-yellow-500" />
                <p>{selectedStation.data.departures.length} departures</p>
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="mt-6 mb-2 text-lg text-slate-400">
                Top departure destinations
              </h2>
              {destinationsData.map((d) => (
                <ul className="mt-2" key={d?.to.stationId}>
                  <li className="flex items-center justify-between gap-3">
                    <Link
                      className="link"
                      href={`/stations/${d?.to.stationId}`}
                    >
                      {d?.to.name}
                    </Link>{" "}
                    <div className="relative h-4 w-1/3 rounded-sm bg-slate-800 text-xs">
                      <div
                        className="mx-1 mt-1 h-2 rounded-sm bg-purple-400"
                        style={{ width: `${d?.to.percentage}%` }}
                      ></div>
                      <span className="sr-only">Percentage of trips: </span>
                      <span className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400">
                        {d?.to.percentage}%
                      </span>
                    </div>
                  </li>
                </ul>
              ))}
            </div>
          </div>
        )}
      </SidePanel>
    </>
  );
};

export default Station;
