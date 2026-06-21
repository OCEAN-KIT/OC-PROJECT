/*
 * 제출 리뷰 목록에서 발생하는 승인/반려/삭제 action flow를 관리합니다.
 * mutation 호출, 성공 후 선택 초기화, 반려 모달 닫기 같은 후처리를 이 hook에 모아
 * HomePage controller와 UI 컴포넌트가 서버 동작 세부사항을 알지 않게 합니다.
 */
import { useCallback, useState } from 'react'
import type { RejectSubmitPayload } from './useRejectSubmissionModal'
import { csvExportByIds } from '../api/submissions'
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
  const { mutate: approveOne } = useApproveMutation()
  const { mutate: rejectOne, isPending: isRejectPending } = useRejectMutation()
  const { mutate: bulkApprove, isPending: isBulkApprovePending } =
    useBulkApproveMutation()
  const { mutate: bulkReject, isPending: isBulkRejectPending } =
    useBulkRejectMutation()
  const { mutate: deleteOne, isPending: isDeletePending } = useDeleteMutation()
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isCsvExporting, setIsCsvExporting] = useState(false)

  const handleSuccessfulReject = useCallback(() => {
    closeRejectModal()
    clearSelection()
  }, [clearSelection, closeRejectModal])

  const handleApproveOne = useCallback(
    (id: string) => {
      approveOne(id)
    },
    [approveOne],
  )

  const handleDeleteOne = useCallback(
    (id: string) => {
      setDeleteTargetId(id)
    },
    [],
  )

  const handleCloseDeleteConfirm = useCallback(() => {
    if (isDeletePending) {
      return
    }

    setDeleteTargetId(null)
  }, [isDeletePending])

  const handleConfirmDelete = useCallback(() => {
    if (!deleteTargetId) {
      return
    }

    deleteOne(deleteTargetId, {
      onSuccess: clearSelection,
      onSettled: () => setDeleteTargetId(null),
    })
  }, [clearSelection, deleteOne, deleteTargetId])

  const deleteConfirmDescription = deleteTargetId
    ? `활동 ID ${deleteTargetId}을(를) 삭제합니다. 삭제한 활동은 되돌릴 수 없습니다.`
    : '삭제할 활동을 선택해 주세요.'

  const deleteConfirmProps = {
    open: deleteTargetId !== null,
    title: '활동을 삭제하시겠습니까?',
    description: deleteConfirmDescription,
    confirmLabel: '삭제',
    cancelLabel: '취소',
    loading: isDeletePending,
    variant: 'danger' as const,
    onConfirm: handleConfirmDelete,
    onClose: handleCloseDeleteConfirm,
  }

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

    bulkApprove(selectedIds, { onSuccess: clearSelection })
  }, [bulkApprove, clearSelection, selected])

  const handleExportCsv = useCallback(async () => {
    const selectedIds = Array.from(selected)

    if (selectedIds.length === 0 || isCsvExporting) {
      return
    }

    setIsCsvExporting(true)

    try {
      await csvExportByIds(selectedIds)
    } catch (error) {
      console.error(error)
      window.alert('CSV 내보내기에 실패했습니다.')
    } finally {
      setIsCsvExporting(false)
    }
  }, [isCsvExporting, selected])

  const handleOpenBulkReject = useCallback(() => {
    openRejectModal(Array.from(selected))
  }, [openRejectModal, selected])

  const handleRejectSubmit = useCallback(
    ({ ids, reason }: RejectSubmitPayload) => {
      if (ids.length === 0) {
        return
      }

      if (ids.length === 1) {
        rejectOne(
          { id: ids[0], reason },
          { onSuccess: handleSuccessfulReject },
        )
        return
      }

      bulkReject({ ids, reason }, { onSuccess: handleSuccessfulReject })
    },
    [bulkReject, handleSuccessfulReject, rejectOne],
  )

  return {
    handleApproveOne,
    handleDeleteOne,
    handleRejectOne,
    handleBulkApprove,
    handleExportCsv,
    handleOpenBulkReject,
    handleRejectSubmit,
    deleteConfirmProps,
    isBulkActionPending: isBulkApprovePending || isBulkRejectPending,
    isCsvExporting,
    isRejectSubmitting: isRejectPending || isBulkRejectPending,
  }
}
