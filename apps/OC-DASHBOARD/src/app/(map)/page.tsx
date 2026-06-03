import { Suspense } from "react";
import MapView from "@/components/mapBox/mapView";
import MapViewErrorBoundary from "@/components/mapBox/mapViewErrorBoundary";
import MapViewLoading from "@/components/mapBox/mapViewLoading";
import { getCachedAreasByRegion } from "@/server/getCachedAreas";

export const revalidate = 3600;

async function MapViewData() {
  const initialAreasByRegion = await getCachedAreasByRegion();

  return (
    <MapViewErrorBoundary>
      <MapView initialAreasByRegion={initialAreasByRegion} />
    </MapViewErrorBoundary>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<MapViewLoading />}>
      <MapViewData />
    </Suspense>
  );
}
