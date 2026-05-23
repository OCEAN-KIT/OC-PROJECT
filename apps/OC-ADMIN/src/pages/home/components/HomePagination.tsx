/*
 * 홈 목록의 페이지 이동 UI만 담당합니다.
 * 현재 페이지와 전체 페이지 수, 이전/다음 핸들러를 받아
 * 버튼 상태와 표시만 처리합니다.
 */
type HomePaginationProps = {
  page: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
}

export function HomePagination({
  page,
  totalPages,
  onPrev,
  onNext,
}: HomePaginationProps) {
  return (
    <div className="mt-4 flex items-center justify-end gap-2 text-sm">
      <button
        disabled={page === 1}
        onClick={onPrev}
        className="rounded border px-3 py-1"
      >
        이전
      </button>
      <span>
        {page} / {totalPages}
      </span>
      <button
        disabled={page === totalPages}
        onClick={onNext}
        className="rounded border px-3 py-1"
      >
        다음
      </button>
    </div>
  )
}
