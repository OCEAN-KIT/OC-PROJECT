/*
 * 리뷰 카드의 상태 chip UI입니다.
 * 상태별 문구와 색상은 reviewCardPresentation에서 계산하고,
 * 이 컴포넌트는 chip 형태로 렌더링하는 일만 담당합니다.
 */
import type { ReviewStatusPresentation } from '../utils/reviewCardPresentation'

type ReviewCardStatusChipProps = {
  status: ReviewStatusPresentation
}

export function ReviewCardStatusChip({ status }: ReviewCardStatusChipProps) {
  return (
    <div className="min-w-0">
      <span
        className={`inline-block max-w-full truncate rounded-full px-2 py-1 text-xs font-medium ring-1 xl:px-3 ${status.className}`}
      >
        {status.label}
      </span>
    </div>
  )
}
