"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import type { MutableRefObject } from "react";
import { REGIONS, type Region } from "../model/regions";
import createMarkerElement from "../lib/mapbox/create-marker-element";

type MarkerEntry = {
  el: HTMLElement;
  marker: mapboxgl.Marker;
  onClick: () => void;
};

type Props = {
  mapRef: MutableRefObject<mapboxgl.Map | null>;
  isMapLoaded: boolean;
  currentLocation: Region | null;
  onSelectRegion: (region: Region) => void;
};

function cleanupMarkerEntry(entry: MarkerEntry) {
  entry.el.removeEventListener("click", entry.onClick);
  entry.marker.remove();
}

export default function useRegionMarkerLayer({
  mapRef,
  isMapLoaded,
  currentLocation,
  onSelectRegion,
}: Props) {
  const markerEntriesRef = useRef<Record<string, MarkerEntry>>({});
  const onSelectRegionRef = useRef(onSelectRegion);

  useEffect(() => {
    onSelectRegionRef.current = onSelectRegion;
  }, [onSelectRegion]);

  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) return;

    const map = mapRef.current;
    const markerEntries: Record<string, MarkerEntry> = {};

    REGIONS.forEach((region) => {
      const markerEl = createMarkerElement({
        color: region.color,
        label: region.label,
        variant: "special",
      });

      const marker = new mapboxgl.Marker({ element: markerEl })
        .setLngLat(region.center)
        .addTo(map);

      const el = marker.getElement();
      el.style.cursor = "pointer";

      const onClick = () => {
        onSelectRegionRef.current(region);
      };

      el.addEventListener("click", onClick);
      markerEntries[region.id] = {
        el,
        marker,
        onClick,
      };
    });

    markerEntriesRef.current = markerEntries;

    return () => {
      Object.values(markerEntries).forEach(cleanupMarkerEntry);
      if (markerEntriesRef.current === markerEntries) {
        markerEntriesRef.current = {};
      }
    };
  }, [isMapLoaded, mapRef]);

  useEffect(() => {
    const markerEntries = markerEntriesRef.current;

    Object.values(markerEntries).forEach((entry) => {
      entry.el.classList.remove("is-selected");
    });

    if (currentLocation?.id && markerEntries[currentLocation.id]) {
      markerEntries[currentLocation.id].el.classList.add("is-selected");
    }
  }, [currentLocation]);
}
