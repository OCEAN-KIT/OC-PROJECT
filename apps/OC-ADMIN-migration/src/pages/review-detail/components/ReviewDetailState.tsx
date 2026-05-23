import { LoadingSpinner } from '#/shared/components/LoadingSpinner'

type ReviewDetailStateProps = {
  type: 'loading' | 'error'
  onRetry?: () => void
}

export function ReviewDetailState({ type, onRetry }: ReviewDetailStateProps) {
  if (type === 'loading') {
    return (
      <ReviewDetailStateFrame>
        <LoadingSpinner color="#3263F1" />
      </ReviewDetailStateFrame>
    )
  }

  return (
    <ReviewDetailStateFrame>
      <div className="rounded-2xl border border-red-100 bg-red-50 px-8 py-10 text-center">
        <p className="text-base font-semibold text-red-700">
          제출 상세 정보를 불러오지 못했습니다.
        </p>
        <p className="mt-2 text-sm text-red-500">
          URL을 확인하거나 잠시 후 다시 시도해주세요.
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            다시 시도
          </button>
        )}
      </div>
    </ReviewDetailStateFrame>
  )
}

function ReviewDetailStateFrame({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-gray-50 px-6 py-10">
      {children}
    </main>
  )
}
