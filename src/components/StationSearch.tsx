import { atom, useAtom } from "jotai";

import { CircleTimesIcon, SearchLocationIcon } from "@components/Icons";

export const searchValueAtom = atom("");

const StationSearch = () => {
  const [value, setValue] = useAtom(searchValueAtom);

  return (
    <div className="relative mb-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <SearchLocationIcon width={20} className="h-5 w-5 text-slate-500" />
      </div>
      <label className="sr-only" htmlFor="station-search">
        Search stations
      </label>
      <input
        id="station-search"
        autoComplete="off"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="block w-full rounded-md border border-sky-800 bg-slate-800 py-2 px-10 text-sm text-slate-300 placeholder-slate-600 outline-none focus:border-sky-500 focus:ring-sky-500"
        placeholder="Search"
      />
      {value && (
        <button
          onClick={() => setValue("")}
          className="absolute inset-y-0 right-1 p-2 text-yellow-500 outline-none hover:text-yellow-400 focus:text-yellow-400"
        >
          <CircleTimesIcon width={18} />
        </button>
      )}
    </div>
  );
};

export default StationSearch;
