"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { COORDS } from "@/constants/geo";
import TopRightControls from "@/components/mapBox/topRightControls";

export default function MapView() {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  // 지역(포항, 울산 등) / 작업영역(세부 구역)
  const [currentLocation, setCurrentLocation] = useState(null);
  const [workingArea, setWorkingArea] = useState(null);

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

    map.dragRotate.enable();
    map.touchZoomRotate.enableRotation();

    map.on("load", () => {
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

  // 선택된 값 콘솔 확인
  useEffect(() => {
    if (currentLocation)
      console.log("현재 지역:", currentLocation.label ?? currentLocation.id);
    if (workingArea)
      console.log("작업 영역:", workingArea.label ?? workingArea.id);
  }, [currentLocation, workingArea]);

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
      <TopRightControls
        currentLocation={currentLocation}
        setCurrentLocation={setCurrentLocation}
        workingArea={workingArea}
        setWorkingArea={setWorkingArea}
      />
    </div>
  );
}
