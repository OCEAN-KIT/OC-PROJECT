import type {
  HabitatType,
  ProjectLevel,
  RestorationRegion,
} from "@ocean-kit/dashboard-domain/types/areas";

export type AreaFilters = {
  region: RestorationRegion | "";
  level: ProjectLevel | "";
  habitat: HabitatType | "";
  from: string;
  to: string;
  keyword: string;
};
