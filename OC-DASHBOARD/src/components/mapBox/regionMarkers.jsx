"use client";

import { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import changeCameraView from "@/utils/map/changeCameraView";

export default function RegionMarkers({
  mapRef,
  currentLocation,
  workingArea,
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
        // ✅ 선택된 작업영역인지 확인
        const isSelected = workingArea?.id === a.id;

        // ✅ 마커 크기 및 색상 조정
        const marker = new mapboxgl.Marker({
          color: baseColor,
          scale: isSelected ? 1.6 : 0.9, // 선택된 건 크게, 나머지는 작게
        })
          .setLngLat(a.center)
          .addTo(map);

        // ✅ 클릭 시 해당 영역으로 카메라 이동
        marker.getElement().addEventListener("click", () => {
          console.log(`Marker clicked: ${a.label}`);
          changeCameraView(map, a);
        });

        markers.push(marker);
      });
    }

    // cleanup
    return () => {
      clearTimeout(timer);
      markers.forEach((m) => m.remove());
    };
  }, [mapRef, currentLocation, workingArea]);

  return null;
}
