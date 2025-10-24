"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { COORDS } from "@/constants/geo";
import TopRightControls from "@/components/mapBox/topRightControls";
import changeCameraView from "@/utils/map/changeCameraView";

export default function MapView() {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  const [currentLocation, setCurrentLocation] = useState(null);
  const [workingArea, setWorkingArea] = useState(null);

  // 지역 선택 시 카메라 이동
  useEffect(() => {
    if (mapRef.current && currentLocation) {
      changeCameraView(mapRef.current, currentLocation);
    }
  }, [currentLocation]);

  // 작업영역 선택 시 카메라 이동
  useEffect(() => {
    if (mapRef.current && workingArea) {
      changeCameraView(mapRef.current, workingArea);
    }
  }, [workingArea]);

  // 지도 초기화
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
      // 포항~울진 초기 뷰 설정
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

      // ✅ DEM(지형 데이터) 추가
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });

      // ✅ 지형 활성화
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.3 });

      // ✅ 하늘 레이어 추가 (3D 구형 느낌)
      map.addLayer({
        id: "sky",
        type: "sky",
        paint: {
          "sky-type": "atmosphere",
          "sky-atmosphere-sun": [0.0, 0.0],
          "sky-atmosphere-sun-intensity": 15,
        },
      });
    });

    // 언마운트 시 메모리 정리
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 선택 상태 콘솔 확인용
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
        mapRef={mapRef}
      />
    </div>
  );
}
