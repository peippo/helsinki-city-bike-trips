import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { trpc } from "@utils/trpc";

import SidePanel from "@components/SidePanel";
import { BikeIcon } from "@components/icons/Icons";

const Home: NextPage = () => {
  const stations = trpc.station.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Stations</title>
      </Head>
      <SidePanel>
        <table className="w-full">
          <thead>
            <tr className="text-left text-yellow-400">
              <th>Station name</th>
              <th>
                <span className="sr-only">Capacity</span>
                <BikeIcon width={20} />
              </th>
            </tr>
          </thead>
          <tbody>
            {stations.data?.map((station) => (
              <tr key={station.id}>
                <td>
                  <Link
                    href={`/stations/${station.stationId}`}
                    className="inline-flex justify-between border-b border-slate-600 text-sm hover:text-yellow-400"
                  >
                    <span>{station.name}</span>
                  </Link>
                </td>
                <td className="text-center">
                  <span className="text-sm">{station.capacity}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SidePanel>
    </>
  );
};

export default Home;
