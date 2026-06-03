import type { RestorationRegion } from "@ocean-kit/dashboard-domain/types/areas";

export type Region = {
  id: RestorationRegion;
  label: string;
  color: string;
  center: [number, number];
};

export const REGIONS: Region[] = [
  { id: "POHANG", label: "포항", color: "#ef4444", center: [129.343, 36.019] },
  { id: "ULJIN", label: "울진", color: "#ef4444", center: [129.409, 36.993] },
];

export const COORDS = Object.fromEntries(
  REGIONS.map((r) => [r.id, r.center]),
) as Record<RestorationRegion, [number, number]>;
