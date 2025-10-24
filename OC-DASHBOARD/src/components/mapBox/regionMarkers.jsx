"use client";

import { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import changeCameraView from "@/utils/map/changeCameraView";

export default function RegionMarkers({
  mapRef,
  currentLocation,
  workingArea,
  setWorkingArea,
}) {
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const markers = [];
    let timer;

    if (currentLocation) {
      const baseColor = currentLocation.color ?? "#10b981";
      const regionAreas = currentLocation.areas ?? [];

      regionAreas.forEach((a) => {
        const isSelected = workingArea?.id === a.id;

        const marker = new mapboxgl.Marker({
          color: baseColor,
          scale: isSelected ? 1.6 : 0.9,
        })
          .setLngLat(a.center)
          .addTo(map);

        // ✅ 호버 시 표시할 텍스트만 심어둠 (UI만)
        marker.getElement().setAttribute("data-tip", a.label);

        // 클릭 동작 그대로
        marker.getElement().addEventListener("click", () => {
          changeCameraView(map, a);
          setWorkingArea(a);
        });

        markers.push(marker);
      });
    }

    return () => {
      clearTimeout(timer);
      markers.forEach((m) => m.remove());
    };
  }, [mapRef, currentLocation, workingArea, setWorkingArea]);

  return null;
}
