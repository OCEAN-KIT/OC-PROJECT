"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { COORDS } from "@/constants/regions";

export default function useMapboxMap() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasLoadedRef = useRef(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<Error | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
    const valid = token.startsWith("pk.") && token.length > 50;

    if (!valid) {
      setMapError(
        new Error(
          "Invalid or missing NEXT_PUBLIC_MAPBOX_TOKEN. Restart the dev server after updating env values.",
        ),
      );
      return;
    }

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/aryu1217/cmhssx9l9006q01r64s59b80d",
      projection: "globe",
      antialias: true,
      center: COORDS.POHANG,
      zoom: 6,
    });

    mapRef.current = map;
    map.dragRotate.enable();
    map.touchZoomRotate.enableRotation();

    const handleLoad = () => {
      const bounds = new mapboxgl.LngLatBounds(
        COORDS.POHANG,
        COORDS.POHANG,
      ).extend(COORDS.ULJIN);

      map.fitBounds(bounds, {
        padding: 140,
        maxZoom: 9,
        offset: [0, -30],
        duration: 1200,
        pitch: 45,
        bearing: -15,
      });

      if (!map.getLayer("sky")) {
        map.addLayer({
          id: "sky",
          type: "sky",
          paint: {
            "sky-type": "atmosphere",
            "sky-atmosphere-sun": [0.0, 0.0],
            "sky-atmosphere-sun-intensity": 15,
          },
        });
      }

      hasLoadedRef.current = true;
      setIsMapLoaded(true);
    };

    const handleError = (event: mapboxgl.ErrorEvent) => {
      const error =
        event.error instanceof Error
          ? event.error
          : new Error("Mapbox runtime error.");

      if (!hasLoadedRef.current) {
        setMapError(error);
        return;
      }

      console.error("[Mapbox] runtime error:", error);
    };

    map.on("load", handleLoad);
    map.on("error", handleError);

    return () => {
      map.off("load", handleLoad);
      map.off("error", handleError);

      try {
        map.remove();
      } finally {
        hasLoadedRef.current = false;
        mapRef.current = null;
      }
    };
  }, []);

  return {
    containerRef,
    mapRef,
    isMapLoaded,
    mapError,
  };
}
