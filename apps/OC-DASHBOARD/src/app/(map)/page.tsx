import MapView from "@/features/map/components/map-view";
import MapViewErrorBoundary from "@/features/map/components/map-view-error-boundary";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <MapViewErrorBoundary>
      <MapView />
    </MapViewErrorBoundary>
  );
}
