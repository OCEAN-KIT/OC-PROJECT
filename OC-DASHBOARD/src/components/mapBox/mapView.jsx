"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { COORDS } from "@/constants/geo"; // { POHANG:[lng,lat], ULJIN:[lng,lat] }
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import TopRightControls from "./topRightControls";

export default function MapView() {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/aryu1217/cmh2v0fch00fb01r5huaq0ra8",
      projection: "globe",
      antialias: true,
      // center/zoom 초기값은 대충만 넣고, 로드 후 fitBounds로 조정
      center: COORDS.POHANG,
      zoom: 5,
    });
    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.scrollZoom.enable();

    map.on("style.load", () => {
      map.setFog({});
      map.addControl(new MapboxLanguage({ defaultLanguage: "ko" }));

      // ✅ 포항~울진 경계 박스 만들고 화면에 맞추기
      const bounds = new mapboxgl.LngLatBounds(COORDS.POHANG, COORDS.POHANG);
      bounds.extend(COORDS.ULJIN);

      const PohangMarker = new mapboxgl.Marker()
        .setLngLat(COORDS.POHANG)
        .addTo(map);

      const UljinMarker = new mapboxgl.Marker()
        .setLngLat(COORDS.ULJIN)
        .addTo(map);

      map.fitBounds(bounds, {
        padding: 80, // 여백(px)
        maxZoom: 12, // 너무 과하게 확대되지 않게 제한
        duration: 1200, // 애니메이션(ms)
        pitch: 45, // (선택) 살짝 기울여서 입체감
        bearing: -15, // (선택) 약간 회전
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        id="map"
        style={{ position: "absolute", top: 0, bottom: 0, width: "100%" }}
      />
      <TopRightControls />
    </>
  );
}
