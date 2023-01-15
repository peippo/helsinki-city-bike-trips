import { atom, useAtom } from "jotai";
import { FlyToInterpolator } from "@deck.gl/core/typed";
import type { ViewStateChangeParameters } from "@deck.gl/core/src/controllers/controller";

const LONGITUDE_RANGE: readonly [number, number] = [24.65, 25.19];
const LATITUDE_RANGE: readonly [number, number] = [60.1, 60.3];

const viewAtom = atom<Record<string, any>>({
  longitude: 24.9235379,
  latitude: 60.17061,
  zoom: 13,
  pitch: 50,
  bearing: 0,
  minZoom: 11,
  maxZoom: 14,
  transitionDuration: 400,
  transitionInterpolator: new FlyToInterpolator(),
});

/**
 * Manage & limit map view state
 */
const useMapViewState = () => {
  const [viewState, setViewState] = useAtom(viewAtom);

  const handleViewStateChange = (params: ViewStateChangeParameters) => {
    const newState = {
      ...params.viewState,
      longitude: Math.min(
        LONGITUDE_RANGE[1],
        Math.max(LONGITUDE_RANGE[0], params.viewState.longitude)
      ),
      latitude: Math.min(
        LATITUDE_RANGE[1],
        Math.max(LATITUDE_RANGE[0], params.viewState.latitude)
      ),
    };

    setViewState(newState);
  };

  return { viewState, setViewState, handleViewStateChange };
};

export default useMapViewState;
