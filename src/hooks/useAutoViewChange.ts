import { useEffect } from "react";
import useSingleStation from "@hooks/useSingleStation";
import useMapViewState from "./useMapViewState";
import { useRouter } from "next/router";

/**
 * Fly to selected station & zoom out map on traffic view
 */
const useAutoViewChange = () => {
  const router = useRouter();
  const { selectedStation } = useSingleStation();
  const { setViewState } = useMapViewState();

  useEffect(() => {
    const flyTo = (longitude: number, latitude: number) => {
      setViewState((state) => ({
        ...state,
        longitude,
        latitude,
        transitionDuration: 400,
        zoom: (state.zoom as number) < 12 ? 13 : (state.zoom as number),
      }));
    };

    const zoomTo = (zoom: number) => {
      setViewState((state) => ({
        ...state,
        zoom: zoom,
        pitch: 50,
        bearing: 0,
        transitionDuration: 600,
      }));
    };

    if (selectedStation) {
      flyTo(selectedStation.longitude, selectedStation.latitude);
    }

    if (router.pathname.includes("traffic")) {
      zoomTo(11);
    }
  }, [selectedStation, setViewState, router.pathname]);
};

export default useAutoViewChange;
