"use client";

import Image from "next/image";
import "mapbox-gl/dist/mapbox-gl.css";
import RegionMarkers from "./regionMarkers";
import TopRightControls from "@/components/mapBox/topRightControls/topRightControls";
import useAppHeightCssVar from "./hooks/useAppHeightCssVar";
import useAreasByRegion from "./hooks/useAreasByRegion";
import useMapboxMap from "./hooks/useMapboxMap";
import useMapCamera from "./hooks/useMapCamera";
import useMapSelection from "./hooks/useMapSelection";
import useRegionMarkerLayer from "./hooks/useRegionMarkerLayer";

export default function MapView() {
  useAppHeightCssVar();

  const { containerRef, mapRef, isMapLoaded, mapError } = useMapboxMap();
  const { areasByRegion, failedRegions, pendingRegions } = useAreasByRegion();
  const {
    currentLocation,
    workingArea,
    activeStage,
    areas,
    setActiveStage,
    selectRegion,
    selectArea,
  } = useMapSelection(areasByRegion);
  const { resetView } = useMapCamera({
    mapRef,
    currentLocation,
    workingArea,
  });

  useRegionMarkerLayer({
    mapRef,
    isMapLoaded,
    currentLocation,
    onSelectRegion: selectRegion,
  });

  if (mapError) {
    throw mapError;
  }

  const selectedRegionId = currentLocation?.id;
  const areaLoadFailed = selectedRegionId
    ? failedRegions.includes(selectedRegionId)
    : false;
  const areaLoading = selectedRegionId
    ? pendingRegions.includes(selectedRegionId)
    : false;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "var(--app-height, 100dvh)",
      }}
    >
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

      <div className="pointer-events-none fixed left-4 top-4 z-40 hidden md:block">
        <div className="oc-panel rounded-2xl px-3 py-2">
          <div className="flex items-center gap-2">
            <Image
              src="/dashboard/oceanCampusLogo.png"
              alt="Ocean Campus"
              width={80}
              height={80}
              className="h-10 w-10 object-contain"
              priority
            />
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-indigo-100/72">
                OC DASHBOARD
              </p>
              <h1 className="text-sm font-semibold tracking-tight text-slate-50">
                해양 생태 복원 현황
              </h1>
            </div>
          </div>
        </div>
      </div>

      <RegionMarkers
        mapRef={mapRef}
        isMapLoaded={isMapLoaded}
        currentLocation={currentLocation}
        areas={areas}
        workingArea={workingArea}
        onSelectArea={selectArea}
      />

      <TopRightControls
        currentLocation={currentLocation}
        areas={areas}
        workingArea={workingArea}
        activeStage={activeStage}
        setActiveStage={setActiveStage}
        areaLoading={areaLoading}
        areaLoadFailed={areaLoadFailed}
        onSelectRegion={selectRegion}
        onSelectArea={selectArea}
        resetView={resetView}
      />

      <div
        className="pointer-events-none fixed z-50 flex justify-center
                   bottom-3 left-0 right-0 px-4
                   max-md:top-3 max-md:bottom-auto"
      >
        <p
          className="oc-panel-plain max-w-[860px] rounded-xl px-4 py-2
                     text-center text-[12px] leading-relaxed text-indigo-50/80
                     max-md:text-[10px] max-md:leading-snug"
        >
          본 대시보드의 모든 정보는 오션캠퍼스 현장 기록 시스템(OC RECORD)을
          통해 수중에서 직접 관측·기록된 데이터를 기반으로 구성되었습니다.
          <br />본 자료는 복원 활동의 경과와 변화를 장기간에 걸쳐 보여주기 위한
          목적을 가집니다.
        </p>
      </div>
    </div>
  );
}
