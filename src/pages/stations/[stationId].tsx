import Head from "next/head";
import Link from "next/link";
import useSingleStation from "@hooks/useSingleStation";
import type { NextPage } from "next";

import SidePanel from "@components/SidePanel";
import ErrorMessage from "@components/ErrorMessage";
import StationDetails from "@components/StationDetails";
import StationDetailsSkeleton from "@components/StationDetailsSkeleton";
import { BackIcon, PinSlashIcon } from "@components/Icons";

const Station: NextPage = () => {
  const { selectedStation, status } = useSingleStation();

  return (
    <>
      <Head>
        <title>
          {selectedStation
            ? `${selectedStation.name} [${selectedStation.stationId}]`
            : "Loading..."}
        </title>
      </Head>

      <SidePanel width="wide">
        <Link className="group mb-3 inline-flex items-center" href="/">
          <BackIcon width={12} className="mr-2 text-yellow-500" />
          <span className="group-link">All stations</span>
        </Link>
        {status === "loading" && <StationDetailsSkeleton />}
        {status === "success" &&
          (selectedStation ? (
            <StationDetails station={selectedStation} />
          ) : (
            <div className="mt-5 mb-2 flex flex-col items-center justify-center text-slate-500">
              <PinSlashIcon width={32} className="mb-2" />
              <p className="text-sm">Unable to find station</p>
            </div>
          ))}
      </SidePanel>

      {status === "error" && (
        <ErrorMessage message="Error loading station, try again later!" />
      )}
    </>
  );
};

export default Station;
