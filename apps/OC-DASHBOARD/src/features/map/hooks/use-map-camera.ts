"use client";

import { useCallback, useEffect, useRef } from "react";
import type mapboxgl from "mapbox-gl";
import type { MutableRefObject } from "react";
import type { AreaSummary } from "@ocean-kit/dashboard-domain/types/areas";
import type { Region } from "@/constants/regions";
import changeCameraView from "@/utils/map/changeCameraView";

const OVERVIEW_CAMERA = {
  center: [129.38, 36.5] as [number, number],
  zoom: 6.5,
  id: "overview",
};

type Props = {
  mapRef: MutableRefObject<mapboxgl.Map | null>;
  currentLocation: Region | null;
  workingArea: AreaSummary | null;
};

export default function useMapCamera({
  mapRef,
  currentLocation,
  workingArea,
}: Props) {
  const previousLocationIdRef = useRef<string | null>(null);

  const resetView = useCallback(() => {
    if (!mapRef.current) return;
    changeCameraView(mapRef.current, OVERVIEW_CAMERA);
  }, [mapRef]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (currentLocation) {
      changeCameraView(mapRef.current, currentLocation);
    } else if (previousLocationIdRef.current) {
      changeCameraView(mapRef.current, OVERVIEW_CAMERA);
    }

    previousLocationIdRef.current = currentLocation?.id ?? null;
  }, [currentLocation, mapRef]);

  useEffect(() => {
    if (!mapRef.current || !workingArea) return;
    changeCameraView(mapRef.current, {
      id: workingArea.id,
      center: [workingArea.lon, workingArea.lat],
    });
  }, [mapRef, workingArea]);

  return {
    resetView,
  };
}
