import Head from "next/head";
import classNames from "classnames";
import { atom, useAtom } from "jotai";
import useJourneys, { JOURNEY_COUNT } from "@hooks/useJourneys";
import type { NextPage } from "next";

import SidePanel from "@components/SidePanel";
import JourneyRow from "@components/JourneyRow";
import JourneyRowSkeleton from "@components/JourneyRowsSkeleton";
import { ArrowLeft, ArrowRight, SortDown, SortUp } from "@components/Icons";

type OrderByOptions = "departureTime" | "duration" | "distance";
type SortOrderOptions = "asc" | "desc";

export const orderByAtom = atom<OrderByOptions>("departureTime");
export const sortOrderAtom = atom<SortOrderOptions>("asc");
export const currentPageAtom = atom<number>(0);

const Station: NextPage = () => {
  const [currentOrderBy, setCurrentOrderBy] = useAtom(orderByAtom);
  const [sortOrder, setSortOrder] = useAtom(sortOrderAtom);
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);

  const {
    journeys,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    status,
    isFetchingNextPage,
  } = useJourneys();

  const handleFetchNextPage = async () => {
    await fetchNextPage();
    setCurrentPage((prev) => prev + 1);
  };

  const handleFetchPreviousPage = async () => {
    await fetchPreviousPage();
    setCurrentPage((prev) => prev - 1);
  };

  const handleOrderByClick = (orderBy: OrderByOptions) => {
    if (currentOrderBy === orderBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setCurrentOrderBy(orderBy);
    }
    setCurrentPage(0);
  };

  const filteredJourneys = journeys?.pages[currentPage]?.items;
  const hasPreviousPage = currentPage !== 0;

  const headerRow: React.FC<{
    orderBy: OrderByOptions;
    text: string;
    align: "left" | "right";
  }> = ({ orderBy, text, align }) => {
    return (
      <th className={`text-${align}`}>
        <button
          className={classNames(
            "flex items-center",
            align === "left" ? "mr-auto" : "ml-auto"
          )}
          onClick={() => handleOrderByClick(orderBy)}
        >
          <span className="text-sm lg:text-base">{text}</span>
          <div className="relative h-4 w-3">
            <SortUp
              className={classNames(
                "absolute ml-2",
                orderBy === currentOrderBy && sortOrder === "asc"
                  ? "text-yellow-500"
                  : "text-slate-600"
              )}
              width={10}
            />
            <SortDown
              className={classNames(
                "absolute ml-2",
                orderBy === currentOrderBy && sortOrder === "desc"
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
                orderBy: "departureTime",
                text: "Departure",
                align: "left",
              })}
              {headerRow({
                orderBy: "duration",
                text: "Duration",
                align: "right",
              })}
              {headerRow({
                orderBy: "distance",
                text: "Distance",
                align: "right",
              })}
            </tr>
          </thead>
          <tbody className="text-sm">
            {(status === "loading" || isFetchingNextPage) &&
              [...Array(JOURNEY_COUNT)].map((_, index) => (
                <JourneyRowSkeleton key={index} index={index} />
              ))}
            {status === "success" &&
              !isFetchingNextPage &&
              filteredJourneys?.map((journey) => (
                <JourneyRow key={journey.id} journey={journey} />
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
