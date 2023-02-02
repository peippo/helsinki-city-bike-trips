import { atom, useAtom } from "jotai";
import { currentPageAtom } from "@pages/journeys";

export const selectedMonthAtom = atom(4);

const BgMask = () => {
  return (
    <div className="pointer-events-none absolute bottom-0 z-30 h-24 w-full bg-gradient-to-t from-black to-transparent"></div>
  );
};

const MonthSelector = () => {
  const [selectedMonth, setSelectedMonth] = useAtom(selectedMonthAtom);
  const [, setCurrentPage] = useAtom(currentPageAtom);

  const months = [
    {
      id: "april",
      number: 4,
      name: "April",
    },
    {
      id: "may",
      number: 5,
      name: "May",
    },
    {
      id: "june",
      number: 6,
      name: "June",
    },
    {
      id: "july",
      number: 7,
      name: "July",
    },
    {
      id: "august",
      number: 8,
      name: "August",
    },
    {
      id: "september",
      number: 9,
      name: "September",
    },
  ];

  const handleMonthClick = (number: number) => {
    setSelectedMonth(number);
    setCurrentPage(0);
  };

  return (
    <>
      <fieldset className="absolute bottom-0 left-1/2 z-40 flex -translate-x-1/2 items-center rounded-t-md border-l border-r border-t border-cyan-800 bg-slate-900 bg-opacity-70 px-2.5 pt-1.5 pb-2 backdrop-blur-lg md:rounded-t-lg md:p-3">
        <legend className="sr-only">Filter by month</legend>

        <div className="flex gap-2">
          {months.map((month) => {
            const { id, number, name } = month;

            return (
              <div key={id}>
                <input
                  name="month-filter"
                  className="peer hidden"
                  value={number}
                  id={id}
                  type="radio"
                  checked={number === selectedMonth}
                  onChange={() => handleMonthClick(number)}
                />
                <label
                  htmlFor={id}
                  className="inline-flex w-full cursor-pointer items-center justify-between rounded px-3 py-1 text-slate-400 hover:text-slate-200 peer-checked:bg-yellow-500 peer-checked:text-slate-900 md:rounded-lg md:px-4"
                >
                  <span className="text-xs md:hidden">
                    {name.substring(0, 3)}
                  </span>
                  <span className="hidden md:inline">{name}</span>
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>

      <BgMask />
    </>
  );
};

export default MonthSelector;
