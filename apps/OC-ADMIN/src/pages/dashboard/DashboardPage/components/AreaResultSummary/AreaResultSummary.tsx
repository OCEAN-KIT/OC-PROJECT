type AreaResultSummaryProps = {
  totalElements: number
}

export default function AreaResultSummary({
  totalElements,
}: AreaResultSummaryProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <p className="text-sm text-gray-500">
        총<span className="font-semibold text-gray-900">{totalElements}</span>
        개의 작업영역
      </p>
    </div>
  )
}
