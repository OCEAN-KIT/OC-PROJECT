import type {
  AreaSummary,
  RestorationRegion,
} from "@ocean-kit/dashboard-domain/types/areas";

export type AreasByRegion = Partial<Record<RestorationRegion, AreaSummary[]>>;
