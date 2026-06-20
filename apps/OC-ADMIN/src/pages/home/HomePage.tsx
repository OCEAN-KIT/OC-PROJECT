'use client'

/*
 * HomePage는 홈 화면의 최상위 조립 컴포넌트입니다.
 * 페이지 상태와 서버 동작의 세부 구현은 useHomePage에 위임하고,
 * 여기서는 화면에 보이는 큰 섹션들이 어떤 순서로 배치되는지만 드러냅니다.
 */
import { HomePageLayout } from './components/HomePageLayout'
import { HomePagination } from './components/HomePagination'
import ReviewList from './components/review-list/review-list'
import RejectModal from './components/reject-reason-modal'
import { SubmissionListSection } from './components/SubmissionListSection'
import { SubmissionToolbar } from './components/SubmissionToolbar'
import { useHomePage } from './hooks/useHomePage'
import { ConfirmDialog } from '#/shared/components/ConfirmDialog'

export function HomePage() {
  const home = useHomePage()

  return (
    <HomePageLayout>
      <SubmissionToolbar {...home.toolbarProps} />

      <SubmissionListSection {...home.listSectionProps}>
        <ReviewList {...home.reviewListProps} />
      </SubmissionListSection>

      <HomePagination {...home.paginationProps} />
      <RejectModal {...home.rejectModalProps} />
      <ConfirmDialog {...home.deleteConfirmProps} />
    </HomePageLayout>
  )
}
