import { trpc } from "@utils/trpc";
import { useAtom } from "jotai";
import { filterAtom, orderByAtom } from "@pages/journeys";

// FIXME:
// Redundant hook, figure out why accessing the cached getBatch query data
// does not work via TRPC's useContext & getInfiniteData helper

const useJourneys = () => {
  const [currentFilter] = useAtom(filterAtom);
  const [orderBy] = useAtom(orderByAtom);

  const {
    data: journeys,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
  } = trpc.journey.getBatch.useInfiniteQuery(
    { limit: 30, filter: currentFilter, orderBy: orderBy },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return { journeys, fetchNextPage, fetchPreviousPage, hasNextPage };
};

export default useJourneys;
