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
  const { station } = useSingleStation();

  return (
    <>
      <Head>
        <title>
          {station.data?.name} [{station.data?.stationId}]
        </title>
      </Head>
      <SidePanel width="wide">
        <Link className="group mb-3 inline-flex items-center" href="/">
          <BackIcon width={12} className="mr-2 text-yellow-500" />
          <span className="group-link">All stations</span>
        </Link>
        {station.data && (
          <div className="flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl">{station.data.name}</h2>
                <span className="text-sm text-slate-400">
                  {station.data.address}
                </span>
              </div>
              <div className="align-center flex aspect-square items-center justify-center rounded-full border-l bg-yellow-400 px-3 text-slate-900">
                <span className="sr-only">Station ID: </span>
                <span>{station.data.stationId}</span>
              </div>
            </div>
            <div className="mb-4 flex items-center">
              <BikeIcon width={24} className="mr-2 text-yellow-500" />
              <p>Capacity {station.data.capacity} bikes</p>
            </div>
            <div className="flex items-center justify-center border-t border-b border-cyan-800">
              <div className="flex flex-grow justify-center px-2 py-3">
                <ArrivalsIcon width={22} className="mr-3 text-yellow-500" />
                <p>{station.data.arrivals.length} arrivals</p>
              </div>
              <div className="flex flex-grow items-center justify-center border-l border-cyan-800 px-2 py-3">
                <DeparturesIcon width={22} className="mr-3 text-yellow-500" />
                <p>{station.data.departures.length} departures</p>
              </div>
            </div>
          </div>
        )}
      </SidePanel>
    </>
  );
};

export default Station;
