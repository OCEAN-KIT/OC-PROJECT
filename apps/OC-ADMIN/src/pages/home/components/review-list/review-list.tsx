'use client'

/*
 * 리뷰 목록의 표 형태 UI를 렌더링합니다.
 * 목록 헤더와 ReviewCard 반복 렌더링만 담당하며,
 * loading/empty/error 같은 목록 영역 상태는 상위 SubmissionListSection이 담당합니다.
 */
import { memo } from 'react'
import ReviewCard from '../review-card/ReviewCard'
import { REVIEW_GRID } from '../review-grid'
import type { Submission } from '../../api/submissions'

type Props = {
  items: Submission[]
  selected?: Set<string>
  onToggleOne: (id: string) => void
  onApproveOne: (id: string) => void
  onRejectOne: (id: string) => void
  onDeleteOne: (id: string) => void
}

function HeaderCell({ children }: { children?: React.ReactNode }) {
  return <div className="min-w-0 truncate whitespace-nowrap">{children}</div>
}

function ReviewList({
  items,
  selected = new Set(),
  onToggleOne,
  onApproveOne,
  onRejectOne,
  onDeleteOne,
}: Props) {
  return (
    <div className="space-y-3 relative">
      {/* 헤더 */}
      <div className="rounded-2xl bg-white px-5 py-3 ring-1 ring-black/5">
        <div className={`${REVIEW_GRID} text-gray-500 items-center`}>
          <HeaderCell>ID</HeaderCell>
          <HeaderCell>현장명</HeaderCell>
          <HeaderCell>제출일</HeaderCell>
          <HeaderCell>활동유형</HeaderCell>
          <HeaderCell>작성자</HeaderCell>
          <HeaderCell>첨부</HeaderCell>
          <HeaderCell>상태</HeaderCell>
          <HeaderCell>{/* 액션 자리 */}</HeaderCell>
        </div>
      </div>

      {/* 리스트 */}
      <div className="space-y-3">
        {items.map((it) => (
          <ReviewCard
            key={it.id}
            review={it}
            selected={selected.has(String(it.id))}
            onToggle={onToggleOne}
            onApprove={onApproveOne}
            onReject={onRejectOne}
            onDelete={onDeleteOne}
          />
        ))}
      </div>
    </div>
  )
}

export default memo(ReviewList)
