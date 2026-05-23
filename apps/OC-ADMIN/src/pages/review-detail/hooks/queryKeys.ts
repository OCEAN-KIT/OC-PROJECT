export const reviewDetailQueryKeys = {
  detail: (submissionId: number | string) =>
    ['submissionDetail', String(submissionId)] as const,
}
