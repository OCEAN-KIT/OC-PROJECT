// src/components/mapBox/MapView.jsx
"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { COORDS } from "@/constants/geo";
import TopRightControls from "@/components/mapBox/topRightControls";

export default function MapView() {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "/map-styles/camouflage.json",
      projection: "globe",
      antialias: true,
      center: COORDS.POHANG,
      zoom: 5,
    });
    mapRef.current = map;

    // 회전 제스처 허용
    map.dragRotate.enable();
    map.touchZoomRotate.enableRotation();

    map.on("load", () => {
      // 포항~울진 뷰 & 마커만 설정 (스타일 관련 추가 작업 X)
      const bounds = new mapboxgl.LngLatBounds(
        COORDS.POHANG,
        COORDS.POHANG
      ).extend(COORDS.ULJIN);

      new mapboxgl.Marker().setLngLat(COORDS.POHANG).addTo(map);
      new mapboxgl.Marker().setLngLat(COORDS.ULJIN).addTo(map);

      map.fitBounds(bounds, {
        padding: 80,
        maxZoom: 12,
        duration: 1200,
        pitch: 45,
        bearing: -15,
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div
        ref={containerRef}
        id="map"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <TopRightControls />
    </div>
  );
}
