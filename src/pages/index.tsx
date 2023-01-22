import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { trpc } from "@utils/trpc";
import { useAtom } from "jotai";
import { mapHoverAtom } from "@hooks/useMapLayers";

import { searchValueAtom } from "@components/StationSearch";
import SidePanel from "@components/SidePanel";
import { BikeIcon, PinSlashIcon } from "@components/icons/Icons";
import StationSearch from "@components/StationSearch";

const Home: NextPage = () => {
  const { data: stations, status } = trpc.station.getAll.useQuery();

  const [, setHoverId] = useAtom(mapHoverAtom);
  const [searchValue] = useAtom(searchValueAtom);
  const filteredStations = stations?.filter((station) =>
    station.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Stations</title>
      </Head>
      {status === "success" && (
        <SidePanel>
          <StationSearch />

          {filteredStations && filteredStations.length > 0 ? (
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
                {filteredStations?.map((station) => (
                  <tr key={station.id}>
                    <td>
                      <Link
                        href={`/stations/${station.stationId}`}
                        className="link"
                        onMouseEnter={() => setHoverId(station.stationId)}
                        onMouseLeave={() => setHoverId(null)}
                        onClick={() => setHoverId(null)}
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
          ) : (
            <div className="mt-8 mb-2 flex flex-col items-center justify-center text-slate-500">
              <PinSlashIcon width={32} className="mb-2" />
              <p className="text-sm">No stations found</p>
            </div>
          )}
        </SidePanel>
      )}
    </>
  );
};

export default Home;
