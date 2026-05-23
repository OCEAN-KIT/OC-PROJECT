import { useQuery } from '@tanstack/react-query'
import { getSubmissionDetails } from '../api/reviewDetail'
import { reviewDetailQueryKeys } from './queryKeys'

export function useSubmissionDetailQuery(submissionId: string) {
  const enabled = Number.isFinite(Number(submissionId))

  return useQuery({
    queryKey: reviewDetailQueryKeys.detail(submissionId),
    queryFn: () => getSubmissionDetails(submissionId),
    staleTime: 30_000,
    retry: false,
    enabled,
  })
}
