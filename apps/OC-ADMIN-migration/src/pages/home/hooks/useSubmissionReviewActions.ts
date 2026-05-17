/*
 * 제출 리뷰 목록에서 발생하는 승인/반려/삭제 action flow를 관리합니다.
 * mutation 호출, 성공 후 선택 초기화, 반려 모달 닫기 같은 후처리를 이 hook에 모아
 * HomePage controller와 UI 컴포넌트가 서버 동작 세부사항을 알지 않게 합니다.
 */
import { useCallback } from 'react'
import type { RejectSubmitPayload } from './useRejectSubmissionModal'
import {
  useApproveMutation,
  useBulkApproveMutation,
  useBulkRejectMutation,
  useDeleteMutation,
  useRejectMutation,
} from './submissions'

type UseSubmissionReviewActionsParams = {
  selected: Set<string>
  clearSelection: () => void
  openRejectModal: (ids: string[]) => void
  closeRejectModal: () => void
}

export function useSubmissionReviewActions({
  selected,
  clearSelection,
  openRejectModal,
  closeRejectModal,
}: UseSubmissionReviewActionsParams) {
  const approveOne = useApproveMutation()
  const rejectOne = useRejectMutation()
  const bulkApprove = useBulkApproveMutation()
  const bulkReject = useBulkRejectMutation()
  const deleteOne = useDeleteMutation()

  const handleSuccessfulReject = useCallback(() => {
    closeRejectModal()
    clearSelection()
  }, [clearSelection, closeRejectModal])

  const handleApproveOne = useCallback(
    (id: string) => {
      approveOne.mutate(id)
    },
    [approveOne],
  )

  const handleDeleteOne = useCallback(
    (id: string) => {
      deleteOne.mutate(id)
    },
    [deleteOne],
  )

  const handleRejectOne = useCallback(
    (id: string) => {
      openRejectModal([id])
    },
    [openRejectModal],
  )

  const handleBulkApprove = useCallback(() => {
    const selectedIds = Array.from(selected)

    if (selectedIds.length === 0) {
      return
    }

    bulkApprove.mutate(selectedIds, { onSuccess: clearSelection })
  }, [bulkApprove, clearSelection, selected])

  const handleOpenBulkReject = useCallback(() => {
    openRejectModal(Array.from(selected))
  }, [openRejectModal, selected])

  const handleRejectSubmit = useCallback(
    ({ ids, reason }: RejectSubmitPayload) => {
      if (ids.length === 0) {
        return
      }

      if (ids.length === 1) {
        rejectOne.mutate(
          { id: ids[0], reason },
          { onSuccess: handleSuccessfulReject },
        )
        return
      }

      bulkReject.mutate(
        { ids, reason },
        { onSuccess: handleSuccessfulReject },
      )
    },
    [bulkReject, handleSuccessfulReject, rejectOne],
  )

  return {
    handleApproveOne,
    handleDeleteOne,
    handleRejectOne,
    handleBulkApprove,
    handleOpenBulkReject,
    handleRejectSubmit,
    isBulkActionPending: bulkApprove.isPending || bulkReject.isPending,
    isRejectSubmitting: rejectOne.isPending || bulkReject.isPending,
  }
}
