import { useRouter } from "next/router";
import { STATION, TRAFFIC, DESTINATION } from "@constants/index";

type ViewModes =
  | typeof STATION
  | typeof TRAFFIC
  | typeof DESTINATION
  | undefined;

/**
 * Get current map mode
 */
const useMapMode = () => {
  const router = useRouter();
  let mode: ViewModes = undefined;

  switch (router.pathname) {
    case "/stations/[stationId]":
      mode = DESTINATION;
      break;
    case "/traffic":
      mode = TRAFFIC;
      break;
    default:
      mode = STATION;
      break;
  }

  return mode;
};

export default useMapMode;
