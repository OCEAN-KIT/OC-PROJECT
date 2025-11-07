// src/types/divers.ts
export type ActivityKind =
  | "Transplantation"
  | "DebrisRemoval"
  | "Research"
  | "Monitoring"
  | "Other";

export type DiverActivityLog = {
  env?: {
    waterTempC?: number;
    current?: string;
    visibilityM?: number;
    depthM?: number;
  };
  activity: ActivityKind;
  details: string;
  media?: { photos?: string[] };
  incidentOrAbnormal?: string;
};
