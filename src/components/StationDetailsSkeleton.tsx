import classNames from "classnames";
import {
  ArrivalsIcon,
  BikeIcon,
  DeparturesIcon,
  DistanceIcon,
  DurationIcon,
} from "@components/Icons";

const StationDetailsSkeleton = () => {
  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="skeleton mb-2 mt-2 h-5 w-44"></span>
          <span className="skeleton mb-2 h-3 w-20"></span>
        </div>
        <div className="align-center flex aspect-square animate-pulse items-center justify-center rounded-full bg-slate-800 px-3">
          <span className="h-4 w-4"></span>
        </div>
      </div>
      <div className="mb-4 flex items-center">
        <BikeIcon width={24} className="mr-2 animate-pulse text-slate-700" />
        <span className="skeleton h-4 w-24"></span>
      </div>
      <div className="relative flex items-center justify-center border-t border-b border-slate-800">
        <div
          className={classNames(
            "flex flex-grow basis-1/2 items-center justify-center border-b-4 border-slate-800 px-2 py-3 text-sm"
          )}
        >
          <ArrivalsIcon
            width={22}
            className="mr-3 animate-pulse text-slate-700"
          />
          <span className="skeleton h-3 w-20"></span>
        </div>
        <div
          className={classNames(
            "flex basis-1/2 items-center justify-center border-b-4 border-l border-slate-800 px-2 py-3 text-sm"
          )}
        >
          <DeparturesIcon
            width={22}
            className="mr-3 animate-pulse text-slate-700"
          />
          <span className="skeleton h-3 w-20"></span>
        </div>
      </div>

      <div className="flex flex-col">
        <span className="skeleton mt-6 mb-2 h-4 w-48"></span>

        <div className="flex items-center justify-around">
          <div className="flex items-center">
            <DistanceIcon
              width={22}
              className="mr-3 animate-pulse text-slate-700"
            />
            <span className="skeleton h-3 w-16"></span>
          </div>

          <div className="flex items-center">
            <DurationIcon
              width={22}
              className="mr-3 animate-pulse text-slate-700"
            />
            <span className="skeleton h-3 w-16"></span>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <span className="skeleton mt-8 mb-6 h-4 w-48"></span>
        <span className="skeleton my-2 h-3 w-24"></span>
        <span className="skeleton my-2 h-3 w-44"></span>
        <span className="skeleton my-2 h-3 w-32"></span>
        <span className="skeleton my-2 h-3 w-40"></span>
        <span className="skeleton my-2 h-3 w-20"></span>
      </div>
    </div>
  );
};

export default StationDetailsSkeleton;
