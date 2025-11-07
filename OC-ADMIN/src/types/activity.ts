// 공용 활동 타입 + 서버 enum 정규화

export type ActivityKind =
  | "Transplantation"
  | "DebrisRemoval"
  | "Research"
  | "Monitoring"
  | "Other";

/** 서버 enum 문자열 → ActivityKind */
export function toActivityKind(raw?: string): ActivityKind {
  switch ((raw ?? "").toUpperCase()) {
    case "URCHIN_REMOVAL":
    case "TRASH_COLLECTION":
      return "DebrisRemoval";
    case "TRANSPLANTATION":
      return "Transplantation";
    case "RESEARCH":
      return "Research";
    case "MONITORING":
      return "Monitoring";
    default:
      return "Other";
  }
}
