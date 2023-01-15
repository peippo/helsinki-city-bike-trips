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
  const { setViewState } = useMapViewState();
  const mode = useMapMode();

  useEffect(() => {
    const flyTo = (longitude: number, latitude: number) => {
      setViewState((state) => ({
        ...state,
        longitude,
        latitude,
        transitionDuration: 400,
        zoom: state.zoom < 12 ? 13 : state.zoom,
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

    if (selectedStation.data) {
      flyTo(selectedStation.data.longitude, selectedStation.data.latitude);
    }

    if (mode === TRAFFIC) {
      zoomTo(11);
    }
  }, [selectedStation.data, mode, setViewState]);
};

export default useAutoViewChange;
