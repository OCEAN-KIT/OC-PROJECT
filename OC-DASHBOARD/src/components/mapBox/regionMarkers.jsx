"use client";

import { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import changeCameraView from "@/utils/map/changeCameraView";
import { createRoot } from "react-dom/client";
import RegionPopup from "./regionPopup";
import { STAGE_META } from "@/constants/stageMeta";

export default function RegionMarkers({
  mapRef,
  currentLocation,
  workingArea,
  setWorkingArea,
  setActiveStage,
}) {
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const markers = [];
    const popups = [];
    const roots = [];

    const getMarkerColor = (area, region) =>
      STAGE_META[area?.stage]?.color ?? region?.color ?? "#10b981";

    if (currentLocation) {
      const regionAreas = currentLocation.areas ?? [];

      regionAreas.forEach((a) => {
        const isSelected = workingArea?.id === a.id;

        // React로 팝업 DOM 렌더
        const popupNode = document.createElement("div");
        const popupRoot = createRoot(popupNode);
        popupRoot.render(<RegionPopup region={a} />);
        roots.push(popupRoot);

        const popup = new mapboxgl.Popup({
          anchor: "bottom",
          closeButton: false,
          closeOnClick: true,
          offset: 16, // 중복 옵션 제거
          className: "region-popup no-tip",
        }).setDOMContent(popupNode);
        popups.push(popup);

        const marker = new mapboxgl.Marker({
          color: getMarkerColor(a, currentLocation),
          scale: isSelected ? 1.6 : 0.9,
        })
          .setLngLat(a.center)
          .setPopup(popup)
          .addTo(map);

        const el = marker.getElement();
        el.setAttribute("data-tip", a?.label ?? "상세 보기");

        el.addEventListener("click", () => {
          setWorkingArea(a);
          setActiveStage?.(a.stage);
          changeCameraView(map, a);
        });

        markers.push(marker);
      });
    }

    return () => {
      markers.forEach((m) => m.remove());
      popups.forEach((p) => p.remove());
      roots.forEach((r) => r.unmount());
    };
  }, [mapRef, currentLocation, workingArea, setWorkingArea, setActiveStage]);

  return null;
}
