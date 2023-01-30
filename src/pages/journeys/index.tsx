import Head from "next/head";
import { atom, useAtom } from "jotai";
import classNames from "classnames";
import { formatDistance, formatDateTime, formatDuration } from "@utils/general";
import { mapHoverAtom } from "@hooks/useMapLayers";
import type { NextPage } from "next";

import SidePanel from "@components/SidePanel";
import {
  ArrowLeft,
  ArrowRight,
  SortDown,
  SortUp,
} from "@components/icons/Icons";
import useJourneys from "@hooks/useJourneys";

type FilterOptions = "departureTime" | "duration" | "distance";
type OrderByOptions = "asc" | "desc";

export const filterAtom = atom<FilterOptions>("departureTime");
export const orderByAtom = atom<OrderByOptions>("asc");
export const currentPageAtom = atom<number>(0);

const Station: NextPage = () => {
  const [currentFilter, setCurrentFilter] = useAtom(filterAtom);
  const [orderBy, setOrderBy] = useAtom(orderByAtom);
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
  const [, setHoverId] = useAtom(mapHoverAtom);

  const { journeys, fetchNextPage, fetchPreviousPage, hasNextPage } =
    useJourneys();

  const handleFetchNextPage = async () => {
    await fetchNextPage();
    setCurrentPage((prev) => prev + 1);
  };

  const handleFetchPreviousPage = async () => {
    await fetchPreviousPage();
    setCurrentPage((prev) => prev - 1);
  };

  const handleFilterClick = (filter: FilterOptions) => {
    if (currentFilter === filter) {
      setOrderBy(orderBy === "asc" ? "desc" : "asc");
    } else {
      setCurrentFilter(filter);
    }
    setCurrentPage(0);
  };

  const filteredJourneys = journeys?.pages[currentPage]?.items;
  const hasPreviousPage = currentPage !== 0;

  const headerRow: React.FC<{
    filter: FilterOptions;
    text: string;
    align: "left" | "right";
  }> = ({ filter, text, align }) => {
    return (
      <th className={`text-${align}`}>
        <button
          className={classNames(
            "flex items-center",
            align === "left" ? "mr-auto" : "ml-auto"
          )}
          onClick={() => handleFilterClick(filter)}
        >
          <span>{text}</span>
          <div className="relative h-4 w-3">
            <SortUp
              className={classNames(
                "absolute ml-2",
                filter === currentFilter && orderBy === "asc"
                  ? "text-yellow-500"
                  : "text-slate-600"
              )}
              width={10}
            />
            <SortDown
              className={classNames(
                "absolute ml-2",
                filter === currentFilter && orderBy === "desc"
                  ? "text-yellow-500"
                  : "text-slate-600"
              )}
              width={10}
            />
          </div>
        </button>
      </th>
    );
  };

  return (
    <>
      <Head>
        <title>Journeys</title>
      </Head>
      <SidePanel width="wide">
        <h2 className="mb-4 text-xl">Browse journeys</h2>

        <table className="w-full">
          <thead>
            <tr className="text-yellow-400">
              {headerRow({
                filter: "departureTime",
                text: "Departure",
                align: "left",
              })}
              {headerRow({
                filter: "duration",
                text: "Duration",
                align: "right",
              })}
              {headerRow({
                filter: "distance",
                text: "Distance",
                align: "right",
              })}
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredJourneys?.map((journey) => (
              <tr
                key={journey.id}
                onMouseEnter={() => setHoverId(journey.id)}
                onMouseLeave={() => setHoverId(null)}
                className="hover:cursor-pointer hover:bg-yellow-500/20"
              >
                <td className="whitespace-nowrap">
                  <span>{formatDateTime(journey.departureTime)}</span>
                </td>
                <td className="w-2/3 text-right">
                  <span>{formatDuration(journey.duration)}</span>
                </td>
                <td className="w-1/3 text-right">
                  <span>{formatDistance(journey.distance)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(hasPreviousPage || hasNextPage) && (
          <div className="mt-5 flex justify-between">
            {hasPreviousPage && (
              <button
                className="group flex items-center"
                onClick={handleFetchPreviousPage}
              >
                <ArrowLeft className="mr-2 text-yellow-500" width={12} />
                <span className="group-link">Previous</span>
              </button>
            )}
            {hasNextPage && (
              <button
                className="group ml-auto flex items-center"
                onClick={handleFetchNextPage}
              >
                <span className="group-link">Next</span>
                <ArrowRight className="ml-2 text-yellow-500" width={12} />
              </button>
            )}
          </div>
        )}
      </SidePanel>
    </>
  );
};

export default Station;
