type LoadingSpinnerProps = {
  color?: string
  size?: number
  className?: string
}

export function LoadingSpinner({
  color = '#3263F1',
  size = 35,
  className = '',
}: LoadingSpinnerProps) {
  return (
    <span
      aria-label="로딩 중"
      role="status"
      className={`inline-block animate-spin rounded-full border-2 border-solid ${className}`}
      style={{
        width: size,
        height: size,
        borderColor: color,
        borderBottomColor: 'transparent',
      }}
    />
  )
}
