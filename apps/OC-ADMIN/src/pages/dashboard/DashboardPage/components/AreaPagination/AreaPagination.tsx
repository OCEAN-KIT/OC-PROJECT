type Props = {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
}

type PageItem = number | 'ellipsis-left' | 'ellipsis-right'

function getVisiblePageItems(totalPages: number, currentPage: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const visiblePages = new Set([
    1,
    totalPages,
    Math.max(1, currentPage - 1),
    currentPage,
    Math.min(totalPages, currentPage + 1),
  ])
  const sortedPages = Array.from(visiblePages).sort((a, b) => a - b)
  const items: PageItem[] = []

  sortedPages.forEach((page, index) => {
    const previousPage = sortedPages[index - 1]

    if (previousPage && page - previousPage > 1) {
      items.push(previousPage === 1 ? 'ellipsis-left' : 'ellipsis-right')
    }

    items.push(page)
  })

  return items
}

export default function AreaPagination({
  totalPages,
  currentPage,
  onPageChange,
}: Props) {
  const pageItems = getVisiblePageItems(totalPages, currentPage)

  return (
    <div className="mt-6 flex justify-center">
      <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white p-1">
        <button
          type="button"
          className="px-3 py-1.5 text-sm rounded text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-transparent"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          이전
        </button>
        {pageItems.map((page) =>
          typeof page === 'number' ? (
            <button
              type="button"
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1.5 text-sm rounded font-medium ${
                page === currentPage
                  ? 'bg-[#2C67BC] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={page} className="px-2 text-sm text-gray-400">
              ...
            </span>
          ),
        )}
        <button
          type="button"
          className="px-3 py-1.5 text-sm rounded text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-transparent"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          다음
        </button>
      </div>
    </div>
  )
}
