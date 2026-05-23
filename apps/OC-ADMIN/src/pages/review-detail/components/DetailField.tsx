type DetailFieldValue =
  | string
  | number
  | number[]
  | string[]
  | null
  | undefined

function formatDetailValue(value: DetailFieldValue) {
  if (Array.isArray(value)) {
    if (value.length >= 5 && value.every((item) => typeof item === 'number')) {
      const [year, month, day, hour, minute] = value

      return `${year}년 ${String(month).padStart(2, '0')}월 ${String(
        day,
      ).padStart(2, '0')}일 ${String(hour).padStart(2, '0')}시 ${String(
        minute,
      ).padStart(2, '0')}분`
    }

    return value.length > 0 ? value.join(', ') : '-'
  }

  return value ?? '-'
}

type DetailFieldProps = {
  label: string
  value: DetailFieldValue
}

export function DetailField({ label, value }: DetailFieldProps) {
  return (
    <dl className="flex items-baseline justify-between gap-4 border-b border-gray-100 py-2">
      <dt className="shrink-0 text-sm text-gray-500">{label}</dt>
      <dd className="text-right text-sm font-medium text-gray-900">
        {formatDetailValue(value)}
      </dd>
    </dl>
  )
}
