"use client";

import { useCallback, useMemo, useState } from "react";
import type { AreaSummary, ProjectLevel } from "@ocean-kit/dashboard-domain/types/areas";
import type { Region } from "@/constants/regions";
import type { AreasByRegion } from "../types";

export default function useMapSelection(initialAreasByRegion: AreasByRegion) {
  const [currentLocation, setCurrentLocation] = useState<Region | null>(null);
  const [workingArea, setWorkingArea] = useState<AreaSummary | null>(null);
  const [activeStage, setActiveStage] = useState<ProjectLevel | null>(null);

  const areas = useMemo(() => {
    if (!currentLocation) return [];
    return initialAreasByRegion[currentLocation.id] ?? [];
  }, [currentLocation, initialAreasByRegion]);

  const clearSelection = useCallback(() => {
    setCurrentLocation(null);
    setWorkingArea(null);
    setActiveStage(null);
  }, []);

  const selectRegion = useCallback(
    (region: Region) => {
      if (currentLocation?.id === region.id) {
        clearSelection();
        return;
      }

      setCurrentLocation(region);
      setWorkingArea(null);
      setActiveStage(null);
    },
    [clearSelection, currentLocation?.id],
  );

  const selectArea = useCallback((area: AreaSummary) => {
    setWorkingArea(area);
    setActiveStage(area.level);
  }, []);

  return {
    currentLocation,
    workingArea,
    activeStage,
    areas,
    setActiveStage,
    selectRegion,
    selectArea,
  };
}
