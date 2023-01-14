import { useEffect } from "react";
import useSingleStation from "@hooks/useSingleStation";
import useMapViewState from "./useMapViewState";
import useMapMode from "./useMapMode";
import { TRAFFIC } from "@constants/index";

/**
 * Fly to selected station & zoom out map on traffic view
 */
const useAutoViewChange = () => {
  const { selectedStation } = useSingleStation();
  const { viewState, setViewState } = useMapViewState();
  const mode = useMapMode();

  const flyTo = (longitude: number, latitude: number) => {
    setViewState({
      ...viewState,
      longitude,
      latitude,
      transitionDuration: 400,
      zoom: viewState.zoom < 12 ? 13 : viewState.zoom,
    });
  };

  const zoomTo = (zoom: number) => {
    setViewState({
      ...viewState,
      zoom: zoom,
      pitch: 50,
      bearing: 0,
      transitionDuration: 600,
    });
  };

  useEffect(() => {
    if (selectedStation.data) {
      flyTo(selectedStation.data.longitude, selectedStation.data.latitude);
    }

    if (mode === TRAFFIC) {
      zoomTo(11);
    }
  }, [selectedStation.data, mode]);
};

export default useAutoViewChange;
