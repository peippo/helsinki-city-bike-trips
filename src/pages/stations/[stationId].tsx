import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { atom, useAtom } from "jotai";
import useSingleStation from "@hooks/useSingleStation";
import { TrafficModes } from "customTypes/enums";

import SidePanel from "@components/SidePanel";
import {
  ArrivalsIcon,
  BackIcon,
  BikeIcon,
  DeparturesIcon,
  DistanceIcon,
  DurationIcon,
} from "@components/icons/Icons";
import classNames from "classnames";

export const trafficModeAtom = atom<TrafficModes>(TrafficModes.Arrival);

const Station: NextPage = () => {
  const { selectedStation, trafficData } = useSingleStation();
  const [trafficMode, setTrafficMode] = useAtom(trafficModeAtom);

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
            <div className="relative flex items-center justify-center border-t border-b border-cyan-800">
              <button
                onClick={() => setTrafficMode(TrafficModes.Arrival)}
                className={classNames(
                  "flex flex-grow basis-1/2 items-center justify-center border-b-4 border-cyan-800 px-2 py-3 text-sm",
                  trafficMode === TrafficModes.Arrival
                    ? "border-b-yellow-500 bg-gradient-to-t from-yellow-500/25 via-transparent to-transparent"
                    : "from-cyan-700/25 via-transparent to-transparent hover:border-b-cyan-700 hover:bg-gradient-to-t"
                )}
              >
                <ArrivalsIcon width={22} className="mr-3 text-yellow-500" />
                <p>{selectedStation.data.arrivals.length} arrivals</p>
              </button>
              <button
                onClick={() => setTrafficMode(TrafficModes.Departure)}
                className={classNames(
                  "flex basis-1/2 items-center justify-center border-b-4 border-l border-cyan-800 px-2 py-3 text-sm",
                  trafficMode === TrafficModes.Departure
                    ? "border-b-yellow-500 bg-gradient-to-t from-yellow-500/25 via-transparent to-transparent"
                    : "from-cyan-700/25 via-transparent to-transparent hover:border-b-cyan-700 hover:bg-gradient-to-t"
                )}
              >
                <DeparturesIcon width={22} className="mr-3 text-yellow-500" />
                <p>{selectedStation.data.departures.length} departures</p>
              </button>
              <div
                className={classNames(
                  "absolute bottom-0 translate-y-full border-x-8 border-t-8 border-b-0 border-x-transparent border-t-yellow-500",
                  trafficMode === TrafficModes.Arrival ? "left-1/4" : "left-3/4"
                )}
              ></div>
            </div>

            <div className="flex flex-col">
              <h2 className="mt-6 mb-2 text-lg text-slate-400">
                Average {trafficMode} journey
              </h2>

              <div className="flex items-center justify-around">
                <div className="flex items-center">
                  <DistanceIcon width={22} className="mr-3 text-yellow-500" />
                  <span className="sr-only">Distance: </span>
                  <span className="mr-2 text-xl text-white">
                    {trafficData[trafficMode].averages.distance}
                  </span>
                  <span className="text-sm">kilometers</span>
                </div>

                <div className="flex items-center">
                  <DurationIcon width={22} className="mr-3 text-yellow-500" />
                  <span className="sr-only">Duration: </span>
                  <span className="mr-2 text-xl text-white">
                    {trafficData[trafficMode].averages.duration}
                  </span>
                  <span className="text-sm">minutes</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <h2 className="mt-6 mb-2 text-lg text-slate-400">
                Top {trafficMode} stations
              </h2>
              {trafficData[trafficMode].stations.map(
                (station) =>
                  station && (
                    <ul
                      className="mt-2"
                      key={
                        station[
                          trafficMode === TrafficModes.Arrival
                            ? "departure"
                            : "arrival"
                        ].stationId
                      }
                    >
                      <li className="flex items-center justify-between gap-3">
                        <Link
                          className="link"
                          href={`/stations/${
                            station[
                              trafficMode === TrafficModes.Arrival
                                ? "departure"
                                : "arrival"
                            ].stationId
                          }`}
                        >
                          {
                            station[
                              trafficMode === TrafficModes.Arrival
                                ? "departure"
                                : "arrival"
                            ].name
                          }
                        </Link>{" "}
                        <div className="relative h-5 w-1/3 rounded-sm bg-slate-800 p-1 text-xs">
                          <div
                            className="h-3 rounded-sm bg-purple-400"
                            style={{ width: `${station.journeyPercentage}%` }}
                          ></div>
                          <span className="sr-only">
                            Percentage of journeys:{" "}
                          </span>
                          <span className="absolute right-1 top-1/2 -translate-y-1/2 pr-1 text-slate-400 mix-blend-difference">
                            {station.journeyPercentage}%
                          </span>
                        </div>
                      </li>
                    </ul>
                  )
              )}
            </div>
          </div>
        )}
      </SidePanel>
    </>
  );
};

export default Station;
