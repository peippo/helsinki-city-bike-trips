import { trpc } from "@utils/trpc";
import { useAtom } from "jotai";
import { orderByAtom, sortOrderAtom } from "@pages/journeys";
import { selectedMonthAtom } from "@components/MonthSelector";

// FIXME:
// Redundant hook, figure out why accessing the cached getBatch query data
// does not work via TRPC's useContext & getInfiniteData helper

const useJourneys = () => {
  const [selectedMonth] = useAtom(selectedMonthAtom);
  const [orderBy] = useAtom(orderByAtom);
  const [sortOrder] = useAtom(sortOrderAtom);

  const {
    data: journeys,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
  } = trpc.journey.getBatch.useInfiniteQuery(
    {
      limit: 30,
      orderBy: orderBy,
      sortOrder: sortOrder,
      month: selectedMonth,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return { journeys, fetchNextPage, fetchPreviousPage, hasNextPage };
};

export default useJourneys;
