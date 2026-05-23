import { ArrowLeft } from 'lucide-react'
import type { SubmissionDetailServer } from '../api/reviewDetail'

type ReviewDetailTopBarProps = {
  detail: SubmissionDetailServer
  onBack: () => void
  onExport: () => void
  onApprove: () => void
  onOpenReject: () => void
  isApprovePending: boolean
}

export function ReviewDetailTopBar({
  detail,
  onBack,
  onExport,
  onApprove,
  onOpenReject,
  isApprovePending,
}: ReviewDetailTopBarProps) {
  const showActions =
    detail.status !== 'APPROVED' && detail.status !== 'REJECTED'
  const canExport = detail.status === 'APPROVED'

  return (
    <div className="mb-6 flex items-center justify-between">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm text-[#34609E] ring-1 ring-gray-200 hover:bg-gray-50"
      >
        <ArrowLeft className="h-4 w-4" />
        뒤로
      </button>

      <div className="text-lg font-bold tracking-tight text-gray-900">
        {detail.siteName}
      </div>

      <div className="flex items-center gap-2">
        {showActions && (
          <button
            type="button"
            aria-label="반려"
            onClick={onOpenReject}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:brightness-105 active:translate-y-[1px]"
          >
            반려
          </button>
        )}

        {showActions && (
          <button
            type="button"
            aria-label="승인"
            disabled={isApprovePending}
            onClick={onApprove}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:brightness-105 active:translate-y-[1px] disabled:opacity-40"
          >
            승인
          </button>
        )}

        {canExport && (
          <button
            type="button"
            aria-label="내보내기"
            onClick={onExport}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-gray-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:brightness-105"
          >
            내보내기
          </button>
        )}
      </div>
    </div>
  )
}
