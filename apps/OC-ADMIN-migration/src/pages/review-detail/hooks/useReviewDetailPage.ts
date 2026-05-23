import { useParams } from '@tanstack/react-router'
import { useCallback, useMemo, useState } from 'react'
import { extractImageUrls } from '../utils/attachment'
import { useSubmissionDetailQuery } from './useSubmissionDetailQuery'

export function useReviewDetailPage() {
  const { submissionId } = useParams({ from: '/review/$submissionId' })
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const query = useSubmissionDetailQuery(submissionId)
  const detail = query.data?.data
  const photos = useMemo(
    () => extractImageUrls(detail?.attachments),
    [detail?.attachments],
  )

  const handleRetry = useCallback(() => {
    void query.refetch()
  }, [query.refetch])

  return {
    submissionId,
    detail,
    photos,
    lightboxIndex,
    setLightboxIndex,
    isFetching: query.isFetching,
    isError:
      !Number.isFinite(Number(submissionId)) ||
      query.isError ||
      (query.isSuccess && !detail),
    onRetry: handleRetry,
  }
}
