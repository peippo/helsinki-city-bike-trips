import classNames from "classnames";
import { useIsFetching } from "@tanstack/react-query";

import { LoadingIcon } from "@components/Icons";

const LoadingSpinner = () => {
  const isFetching = useIsFetching();

  return (
    <div
      className={classNames(
        "pointer-events-none absolute top-7 right-5 z-50 animate-spin transition-opacity",
        "lg:left-5 lg:bottom-5 lg:top-auto lg:right-auto",
        isFetching ? "opacity-1" : "opacity-0"
      )}
    >
      <LoadingIcon width={32} className="text-yellow-500" />
    </div>
  );
};

export default LoadingSpinner;
