import { trpc } from "@utils/trpc";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { orderByAtom, sortOrderAtom } from "@pages/journeys";
import { selectedMonthAtom } from "@components/MonthSelector";

// FIXME:
// Redundant hook, figure out why accessing the cached getBatch query data
// does not work via TRPC's useContext & getInfiniteData helper

export const JOURNEY_COUNT = 30;

const useJourneys = () => {
  const router = useRouter();
  const [selectedMonth] = useAtom(selectedMonthAtom);
  const [orderBy] = useAtom(orderByAtom);
  const [sortOrder] = useAtom(sortOrderAtom);

  const {
    data: journeys,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    status,
  } = trpc.journey.getBatch.useInfiniteQuery(
    {
      limit: JOURNEY_COUNT,
      orderBy: orderBy,
      sortOrder: sortOrder,
      month: selectedMonth,
    },
    {
      enabled: router.route === "/journeys",
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return { journeys, fetchNextPage, fetchPreviousPage, hasNextPage, status };
};

export default useJourneys;
