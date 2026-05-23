/*
 * 홈/제출 관련 React Query key를 한곳에서 생성합니다.
 * query와 mutation이 같은 key 체계를 공유해야
 * invalidate 범위가 흔들리지 않습니다.
 */
export const queryKeys = {
  myInfo: ["myInfo"] as const,
  species: ["species"] as const,
  submissions: {
    all: ["submissions"] as const,
    list: (page: number, pageSize: number, filters: unknown) =>
      ["submissions", { page, pageSize, filters }] as const,
  },
  submissionDetail: (submissionId: number | string) =>
    ["submissionDetail", submissionId] as const,
  areas: {
    all: ["areas"] as const,
    list: (page: number, filters: unknown) => ["areas", page, filters] as const,
    detail: (areaId: number) => ["areas", areaId, "detail"] as const,
    transplantLogs: (areaId: number) =>
      ["areas", areaId, "transplant-logs"] as const,
    growthLogs: (areaId: number) => ["areas", areaId, "growth-logs"] as const,
    representativeSpecies: (areaId: number) =>
      ["areas", areaId, "representative-species"] as const,
    environmentLogs: (areaId: number) =>
      ["areas", areaId, "environment-logs"] as const,
    mediaLogs: (areaId: number) => ["areas", areaId, "media-logs"] as const,
  },
};
