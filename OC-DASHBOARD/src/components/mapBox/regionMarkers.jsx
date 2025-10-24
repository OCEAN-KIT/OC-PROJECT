"use client";

import { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import changeCameraView from "@/utils/map/changeCameraView";
import { createRoot } from "react-dom/client";
import RegionPopup from "./regionPopup";

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

    if (currentLocation) {
      const baseColor = currentLocation.color ?? "#10b981";
      const regionAreas = currentLocation.areas ?? [];

      regionAreas.forEach((a) => {
        const isSelected = workingArea?.id === a.id;

        // 팝업 DOM 만들고 React로 렌더
        const popupNode = document.createElement("div");
        const popupRoot = createRoot(popupNode);
        popupRoot.render(<RegionPopup region={a} />);

        const popup = new mapboxgl.Popup({
          offset: 16,
          anchor: "bottom",
          closeButton: false,
          closeOnClick: true,
          offset: [140, 0, 50, 0],
          className: "region-popup no-tip", // 꼬다리 제거용 클래스
        }).setDOMContent(popupNode);

        const marker = new mapboxgl.Marker({
          color: baseColor,
          scale: isSelected ? 1.6 : 0.9,
        })
          .setLngLat(a.center)
          .setPopup(popup)
          .addTo(map);

        const el = marker.getElement();
        el.setAttribute("data-tip", a?.label ?? "상세 보기");

        el.addEventListener("click", () => {
          console.log("[RegionMarkers] click:", a?.label);
          setWorkingArea && setWorkingArea(a);
          changeCameraView(map, a);
          // 필요 시 수동 토글: marker.togglePopup();
        });

        markers.push(marker);
      });
    }

    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [mapRef, currentLocation, workingArea, setWorkingArea]);

  return null;
}
