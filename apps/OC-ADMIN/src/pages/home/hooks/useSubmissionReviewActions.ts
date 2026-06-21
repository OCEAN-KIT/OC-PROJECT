/*
 * 제출 리뷰 목록에서 발생하는 승인/반려/삭제 action flow를 관리합니다.
 * mutation 호출, 성공 후 선택 초기화, 반려 모달 닫기 같은 후처리를 이 hook에 모아
 * HomePage controller와 UI 컴포넌트가 서버 동작 세부사항을 알지 않게 합니다.
 */
import { useCallback, useState } from 'react'
import { isAxiosError } from 'axios'
import type { RejectSubmitPayload } from './useRejectSubmissionModal'
import { csvExportByIds } from '../api/submissions'
import type { Submission } from '../api/submissions'
import {
  useApproveMutation,
  useBulkApproveMutation,
  useBulkRejectMutation,
  useDeleteMutation,
  useRejectMutation,
} from './submissions'

type UseSubmissionReviewActionsParams = {
  items: Submission[]
  selected: Set<string>
  clearSelection: () => void
  openRejectModal: (ids: string[]) => void
  closeRejectModal: () => void
}

const STATUS_CHANGE_LOCKED_MESSAGE =
  '이미 반려 또는 승인 처리된 작업은 변경할 수 없습니다.'

function hasStatusLockedSelection(items: Submission[], ids: string[]) {
  const selectedIdSet = new Set(ids)

  return items.some(
    (item) => selectedIdSet.has(String(item.id)) && item.status !== 'pending',
  )
}

function getRejectErrorMessage(error: unknown) {
  if (isAxiosError(error)) {
    const responseData = error.response?.data

    if (
      responseData &&
      typeof responseData === 'object' &&
      'message' in responseData &&
      typeof responseData.message === 'string' &&
      responseData.message.trim().length > 0
    ) {
      return responseData.message
    }

    if (error.response) {
      return STATUS_CHANGE_LOCKED_MESSAGE
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  return STATUS_CHANGE_LOCKED_MESSAGE
}

export function useSubmissionReviewActions({
  items,
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
  const [rejectErrorMessage, setRejectErrorMessage] = useState<
    string | null
  >(null)

  const showRejectError = useCallback((error: unknown) => {
    setRejectErrorMessage(getRejectErrorMessage(error))
  }, [])

  const clearRejectError = useCallback(() => {
    setRejectErrorMessage(null)
  }, [])

  const handleCloseRejectModal = useCallback(() => {
    clearRejectError()
    closeRejectModal()
  }, [clearRejectError, closeRejectModal])

  const handleSuccessfulReject = useCallback(() => {
    clearRejectError()
    closeRejectModal()
    clearSelection()
  }, [clearRejectError, clearSelection, closeRejectModal])

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
      clearRejectError()
      openRejectModal([id])
    },
    [clearRejectError, openRejectModal],
  )

  const handleBulkApprove = useCallback(() => {
    const selectedIds = Array.from(selected)

    if (selectedIds.length === 0) {
      return
    }

    if (hasStatusLockedSelection(items, selectedIds)) {
      window.alert(STATUS_CHANGE_LOCKED_MESSAGE)
      return
    }

    bulkApprove(selectedIds, { onSuccess: clearSelection })
  }, [bulkApprove, clearSelection, items, selected])

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
    const selectedIds = Array.from(selected)

    if (selectedIds.length === 0) {
      return
    }

    if (hasStatusLockedSelection(items, selectedIds)) {
      window.alert(STATUS_CHANGE_LOCKED_MESSAGE)
      return
    }

    clearRejectError()
    openRejectModal(selectedIds)
  }, [clearRejectError, items, openRejectModal, selected])

  const handleRejectSubmit = useCallback(
    ({ ids, reason }: RejectSubmitPayload) => {
      if (ids.length === 0) {
        return
      }

      clearRejectError()

      if (hasStatusLockedSelection(items, ids)) {
        setRejectErrorMessage(STATUS_CHANGE_LOCKED_MESSAGE)
        return
      }

      if (ids.length === 1) {
        rejectOne(
          { id: ids[0], reason },
          {
            onSuccess: handleSuccessfulReject,
            onError: showRejectError,
          },
        )
        return
      }

      bulkReject(
        { ids, reason },
        {
          onSuccess: handleSuccessfulReject,
          onError: showRejectError,
        },
      )
    },
    [
      bulkReject,
      clearRejectError,
      handleSuccessfulReject,
      items,
      rejectOne,
      showRejectError,
    ],
  )

  return {
    handleApproveOne,
    handleDeleteOne,
    handleRejectOne,
    handleBulkApprove,
    handleExportCsv,
    handleOpenBulkReject,
    handleRejectSubmit,
    handleCloseRejectModal,
    deleteConfirmProps,
    rejectErrorMessage,
    isBulkActionPending: isBulkApprovePending || isBulkRejectPending,
    isCsvExporting,
    isRejectSubmitting: isRejectPending || isBulkRejectPending,
  }
}
