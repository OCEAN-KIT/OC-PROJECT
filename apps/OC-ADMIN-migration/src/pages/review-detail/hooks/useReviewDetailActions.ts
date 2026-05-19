import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { DEFAULT_HOME_SEARCH } from '#/pages/home/homeSearch'
import type { RejectSubmitPayload } from '#/pages/home/hooks/useRejectSubmissionModal'
import {
  useApproveMutation,
  useRejectMutation,
} from '#/pages/home/hooks/submissions'
import type { SubmissionDetailServer } from '../api/reviewDetail'
import { csvExportByIds } from '../api/reviewDetail'
import { reviewDetailQueryKeys } from './queryKeys'

type UseReviewDetailActionsParams = {
  detail: SubmissionDetailServer
}

export function useReviewDetailActions({
  detail,
}: UseReviewDetailActionsParams) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [rejectOpen, setRejectOpen] = useState(false)
  const submissionId = String(detail.submissionId)
  const { mutate: approve, isPending: isApprovePending } = useApproveMutation()
  const { mutate: reject, isPending: isRejectPending } = useRejectMutation()

  const invalidateDetail = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: reviewDetailQueryKeys.detail(submissionId),
    })
  }, [queryClient, submissionId])

  const handleBack = useCallback(() => {
    void navigate({ to: '/home', search: DEFAULT_HOME_SEARCH })
  }, [navigate])

  const handleExport = useCallback(() => {
    void csvExportByIds([detail.submissionId])
  }, [detail.submissionId])

  const handleApprove = useCallback(() => {
    approve(submissionId, { onSuccess: invalidateDetail })
  }, [approve, invalidateDetail, submissionId])

  const handleOpenReject = useCallback(() => {
    setRejectOpen(true)
  }, [])

  const handleCloseReject = useCallback(() => {
    setRejectOpen(false)
  }, [])

  const handleRejectSubmit = useCallback(
    ({ reason }: RejectSubmitPayload) => {
      reject(
        { id: submissionId, reason },
        {
          onSuccess: () => {
            setRejectOpen(false)
            invalidateDetail()
          },
        },
      )
    },
    [invalidateDetail, reject, submissionId],
  )

  return {
    topBarProps: {
      onBack: handleBack,
      onExport: handleExport,
      onApprove: handleApprove,
      onOpenReject: handleOpenReject,
      isApprovePending,
    },
    rejectModalProps: {
      open: rejectOpen,
      ids: [submissionId],
      loading: isRejectPending,
      onClose: handleCloseReject,
      onSubmit: handleRejectSubmit,
    },
  }
}
