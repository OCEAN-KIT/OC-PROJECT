import MapView from "@/components/mapBox/mapView";
import MapViewErrorBoundary from "@/components/mapBox/mapViewErrorBoundary";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <MapViewErrorBoundary>
      <MapView />
    </MapViewErrorBoundary>
  );
}
