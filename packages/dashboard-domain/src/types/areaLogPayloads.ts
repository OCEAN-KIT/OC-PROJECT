// 작업영역 로그 폼에서 공통으로 사용하는 enum과 요청 payload 타입.

export type TransplantMethod =
  | "SEEDLING_STRING"
  | "ROPE"
  | "ROCK_FIXATION"
  | "TRANSPLANT_MODULE"
  | "DIRECT_FIXATION";

export type SpeciesAttachmentStatus = "GOOD" | "NORMAL" | "POOR";

export type TransplantLogPayload = {
  recordDate: string;
  method: TransplantMethod | "";
  speciesId: number;
  count: number;
  areaSize: number;
  attachmentStatus: SpeciesAttachmentStatus | "";
};

export type GrowthStatus = "GOOD" | "NORMAL" | "POOR";

export type GrowthLogPayload = {
  speciesId: number;
  recordDate: string;
  growthLength: number;
  status: GrowthStatus | "";
};

export type EnvironmentCondition = "GOOD" | "NORMAL" | "POOR";

export type EnvironmentLogPayload = {
  recordDate: string;
  temperature: number;
  visibility: EnvironmentCondition | "";
  current: EnvironmentCondition | "";
  surge: EnvironmentCondition | "";
  wave: EnvironmentCondition | "";
};

export type MediaCategory = "BEFORE" | "AFTER" | "TIMELINE";

export type MediaLogPayload = {
  recordDate: string;
  mediaUrl: string;
  caption: string;
  category: MediaCategory | "";
};
