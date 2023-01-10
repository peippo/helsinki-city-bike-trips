import { useEffect } from "react";
import { atom, useAtom } from "jotai";
import { FlyToInterpolator } from "@deck.gl/core/typed";
import { Station } from "@prisma/client";

const LONGITUDE_RANGE: readonly [number, number] = [24.65, 25.19];
const LATITUDE_RANGE: readonly [number, number] = [60.1, 60.3];

const viewAtom = atom({
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

const useMapViewState = (selectedStation: Station | undefined | null) => {
  const [viewState, setViewState] = useAtom(viewAtom);

  const handleViewStateChange = (event: any) => {
    const newState = {
      ...event.viewState,
      longitude: Math.min(
        LONGITUDE_RANGE[1],
        Math.max(LONGITUDE_RANGE[0], event.viewState.longitude)
      ),
      latitude: Math.min(
        LATITUDE_RANGE[1],
        Math.max(LATITUDE_RANGE[0], event.viewState.latitude)
      ),
    };

    setViewState(newState);
  };

  const flyTo = (longitude: number, latitude: number) => {
    setViewState({
      ...viewState,
      longitude,
      latitude,
      transitionDuration: 400,
    });
  };

  useEffect(() => {
    if (!selectedStation) return;

    flyTo(selectedStation.longitude, selectedStation.latitude);
  }, [selectedStation]);

  return { viewState, setViewState, handleViewStateChange };
};

export default useMapViewState;
