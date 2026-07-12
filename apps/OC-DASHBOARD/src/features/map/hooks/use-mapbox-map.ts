"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { COORDS } from "../model/regions";

export default function useMapboxMap() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasLoadedRef = useRef(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<Error | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const token = process.env.MAPBOX_TOKEN || "";
    const styleUrl = process.env.MAPBOX_STYLE_URL || "";
    const validToken = token.startsWith("pk.") && token.length > 50;
    const validStyleUrl = styleUrl.startsWith("mapbox://styles/");

    if (!validToken || !validStyleUrl) {
      setMapError(
        new Error(
          "Invalid or missing MAPBOX_TOKEN or MAPBOX_STYLE_URL. Restart the dev server after updating env values.",
        ),
      );
      return;
    }

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: styleUrl,
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
