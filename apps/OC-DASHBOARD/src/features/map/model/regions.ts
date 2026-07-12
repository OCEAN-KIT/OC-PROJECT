import type { RestorationRegion } from "@ocean-kit/dashboard-domain/types/areas";

export type Region = {
  id: RestorationRegion;
  label: string;
  color: string;
  center: [number, number];
  zoom: number;
};

export const REGIONS: Region[] = [
  {
    id: "POHANG",
    label: "포항",
    color: "#ef4444",
    center: [129.343, 36.019],
    zoom: 10.3,
  },
  {
    id: "ULJIN",
    label: "울진",
    color: "#ef4444",
    center: [129.467693, 36.722994],
    zoom: 13.2,
  },
];

export const COORDS = Object.fromEntries(
  REGIONS.map((r) => [r.id, r.center]),
) as Record<RestorationRegion, [number, number]>;
