/*
 * 제출 목록 영역의 상태 표현을 담당하는 section wrapper입니다.
 * 로딩/에러 상태를 먼저 처리하고, 준비되면 children을 렌더링합니다.
 * ReviewList의 item/selection/action props를 몰라도 되도록 children 슬롯으로 분리했습니다.
 */
import { ClipLoader } from 'react-spinners'

type SubmissionListSectionProps = {
  isFetching: boolean
  isError: boolean
  errorMessage?: string
  onRetry: () => void
  children: React.ReactNode
}

export function SubmissionListSection({
  isFetching,
  isError,
  errorMessage,
  onRetry,
  children,
}: SubmissionListSectionProps) {
  if (isFetching) {
    return (
      <div className="flex h-screen -mt-50 items-center justify-center">
        <ClipLoader color="#3263F1" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-6 py-10 text-center">
        <p className="text-base font-semibold text-red-700">
          {errorMessage ?? '목록을 불러오지 못했습니다.'}
        </p>
        <p className="mt-2 text-sm text-red-500">
          잠시 후 다시 시도하거나 필터 조건을 확인해주세요.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          다시 시도
        </button>
      </div>
    )
  }

  return <div className="mt-4">{children}</div>
}
