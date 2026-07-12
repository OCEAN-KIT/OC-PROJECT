"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import type { MutableRefObject } from "react";
import type { AreaSummary } from "@ocean-kit/dashboard-domain/types/areas";
import type { Region } from "../model/regions";
import RegionPopup from "./region-popup";
import { STAGE_META } from "@/shared/model/stage-meta";
import { useRouter } from "next/navigation";
import createMarkerElement from "../lib/mapbox/create-marker-element";

type MarkerEntry = {
  el: HTMLElement;
  marker: mapboxgl.Marker;
  onClick: () => void;
  popup: mapboxgl.Popup;
  popupRoot: Root;
};

type Props = {
  mapRef: MutableRefObject<mapboxgl.Map | null>;
  isMapLoaded: boolean;
  currentLocation: Region | null;
  areas: AreaSummary[];
  workingArea: AreaSummary | null;
  onSelectArea: (area: AreaSummary) => void;
};

function cleanupMarkerEntry(entry: MarkerEntry | undefined) {
  if (!entry) return;

  entry.el.removeEventListener("click", entry.onClick);
  entry.marker.remove();
  entry.popup.remove();
  setTimeout(() => entry.popupRoot.unmount(), 0);
}

function getMarkerLngLat(area: AreaSummary): [number, number] | null {
  const lon = Number(area.lon);
  const lat = Number(area.lat);

  if (
    !Number.isFinite(lon) ||
    !Number.isFinite(lat) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    return null;
  }

  return [lon, lat];
}

export default function RegionMarkers({
  mapRef,
  isMapLoaded,
  currentLocation,
  areas,
  workingArea,
  onSelectArea,
}: Props) {
  const router = useRouter();
  const markerEntriesRef = useRef<Map<number, MarkerEntry>>(new Map());
  const selectedMarkerIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) return;

    const map = mapRef.current;
    const markerEntries = new Map<number, MarkerEntry>();

    const getMarkerColor = (area: AreaSummary) => {
      const level = String(area.level);

      return level in STAGE_META
        ? STAGE_META[level as keyof typeof STAGE_META].color
        : currentLocation?.color ?? "#ef4444";
    };

    if (currentLocation && areas.length) {
      areas.forEach((a) => {
        const lngLat = getMarkerLngLat(a);

        if (!lngLat) {
          console.warn("[Mapbox] skip area marker: invalid lng/lat", {
            id: a?.id,
            name: a?.name,
            lon: a?.lon,
            lat: a?.lat,
          });
          return;
        }

        try {
          // React로 팝업 DOM 렌더
          const popupNode = document.createElement("div");
          const popupRoot = createRoot(popupNode);
          popupRoot.render(
            <RegionPopup
              region={a}
              onOpen={() => {
                router.push(`/detailInfo/${a.id}`);
              }}
            />,
          );

          const popup = new mapboxgl.Popup({
            anchor: "left",
            closeButton: false,
            closeOnClick: true,
            offset: [30, 0],
            className: "region-popup no-tip",
          }).setDOMContent(popupNode);

          const markerEl = createMarkerElement({
            color: getMarkerColor(a),
            label: a.name ?? "상세 보기",
          });
          markerEl.dataset.areaId = String(a.id ?? "");
          markerEl.dataset.areaName = a.name ?? "";

          const marker = new mapboxgl.Marker({
            element: markerEl,
          })
            .setLngLat(lngLat)
            .setPopup(popup)
            .addTo(map);

          const el = marker.getElement();
          const onClick = () => {
            onSelectArea(a);
          };

          el.addEventListener("click", onClick);
          markerEntries.set(a.id, {
            el,
            marker,
            onClick,
            popup,
            popupRoot,
          });
        } catch (error) {
          console.error("[Mapbox] failed to create area marker", {
            id: a?.id,
            name: a?.name,
            lon: a?.lon,
            lat: a?.lat,
            error,
          });
        }
      });
    }

    markerEntriesRef.current = markerEntries;

    const selectedId = selectedMarkerIdRef.current;
    if (selectedId != null) {
      markerEntries.get(selectedId)?.el.classList.add("is-selected");
    }

    return () => {
      markerEntries.forEach((entry) => cleanupMarkerEntry(entry));
      if (markerEntriesRef.current === markerEntries) {
        markerEntriesRef.current = new Map();
      }
    };
  }, [mapRef, isMapLoaded, currentLocation, areas, onSelectArea, router]);

  useEffect(() => {
    const markerEntries = markerEntriesRef.current;
    const prevSelectedId = selectedMarkerIdRef.current;
    const nextSelectedId =
      workingArea?.id != null && markerEntries.has(workingArea.id)
        ? workingArea.id
        : null;

    if (prevSelectedId != null && prevSelectedId !== nextSelectedId) {
      markerEntries.get(prevSelectedId)?.el.classList.remove("is-selected");
    }

    if (nextSelectedId != null) {
      markerEntries.get(nextSelectedId)?.el.classList.add("is-selected");
    }

    selectedMarkerIdRef.current = nextSelectedId;
  }, [workingArea, areas, currentLocation]);

  return null;
}
