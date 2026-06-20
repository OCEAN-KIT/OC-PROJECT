/*
 * 홈 페이지 전용 hook들을 조립하는 얇은 coordinator입니다.
 * 목록 조회, 선택 상태, 반려 모달, mutation action flow는 각각 전용 hook이 소유하고,
 * 이 파일은 UI 섹션들이 바로 사용할 props 형태로 연결만 담당합니다.
 */
import { useRejectSubmissionModal } from './useRejectSubmissionModal'
import { useSubmissionListState } from './useSubmissionListState'
import { useSubmissionSelection } from './useSubmissionSelection'
import { useSubmissionReviewActions } from './useSubmissionReviewActions'

export function useHomePage() {
  // 목록 조회에 필요한 필터, 페이지네이션, query 상태를 가져옵니다.
  // HomePage는 page/filter/query 세부 상태를 직접 알 필요 없이
  // 목록 섹션에 필요한 데이터와 toolbar/pagination props만 사용합니다.
  const submissionList = useSubmissionListState()

  // 현재 화면에 렌더링된 제출 목록을 기준으로 선택 상태를 관리합니다.
  // 선택 가능한 항목 계산과 전체 선택/해제, 선택 초기화는 selection hook의 책임입니다.
  const selection = useSubmissionSelection(submissionList.items)

  // 반려 모달은 "열려 있는지"와 "어떤 id들을 반려할지"만 소유합니다.
  // 실제 반려 mutation은 아래 reviewActions가 담당합니다.
  const rejectModal = useRejectSubmissionModal()

  // 승인/반려/삭제 같은 서버 변경 동작을 한곳에서 연결합니다.
  // 선택 초기화, 반려 성공 후 모달 닫기처럼 여러 hook을 함께 써야 하는 후처리도 여기서 묶습니다.
  const reviewActions = useSubmissionReviewActions({
    selected: selection.selected,
    clearSelection: selection.clear,
    openRejectModal: rejectModal.open,
    closeRejectModal: rejectModal.close,
  })

  return {
    listSectionProps: submissionList.listSectionProps,

    // 상단 툴바는 필터 입력/검색/일괄 액션을 표시합니다.
    // 필터와 검색은 submissionList에서, 일괄 액션은 selection + reviewActions에서 조립합니다.
    toolbarProps: {
      ...submissionList.toolbarProps,
      bulkActions: {
        total: selection.total,
        selectedCount: selection.count,
        allSelected: selection.allSelected,
        onToggleAll: selection.toggleAll,
        onBulkApprove: reviewActions.handleBulkApprove,
        onOpenReject: reviewActions.handleOpenBulkReject,
        disabled:
          submissionList.listSectionProps.isFetching ||
          reviewActions.isBulkActionPending,
      },
    },

    // 리뷰 목록은 item 렌더링과 단건 action만 알면 됩니다.
    // 선택 가능 여부, mutation 실행 방식, 모달 open 방식은 하위 hook들에 숨깁니다.
    reviewListProps: {
      items: submissionList.items,
      selected: selection.selected,
      onToggleOne: selection.toggleOne,
      onRejectOne: reviewActions.handleRejectOne,
      onApproveOne: reviewActions.handleApproveOne,
      onDeleteOne: reviewActions.handleDeleteOne,
    },

    // 페이지 이동 UI가 필요한 값과 핸들러는 목록 조회 상태와 강하게 묶여 있으므로
    // useSubmissionListState가 만든 props를 그대로 전달합니다.
    paginationProps: submissionList.paginationProps,

    // 반려 모달 UI는 open/ids/loading/onClose/onSubmit 계약만 사용합니다.
    // 단건 반려와 일괄 반려의 분기는 reviewActions.handleRejectSubmit 내부에서 처리합니다.
    rejectModalProps: {
      open: rejectModal.isOpen,
      ids: rejectModal.ids,
      loading: reviewActions.isRejectSubmitting,
      onClose: rejectModal.close,
      onSubmit: reviewActions.handleRejectSubmit,
    },

    deleteConfirmProps: reviewActions.deleteConfirmProps,
  }
}
