type RejectReasonBannerProps = {
  reason?: string
}

export function RejectReasonBanner({ reason }: RejectReasonBannerProps) {
  if (!reason) return null

  return (
    <div className="mb-4 whitespace-pre-wrap break-words rounded-xl bg-rose-50 px-5 py-3 text-sm text-rose-600 ring-1 ring-rose-200 [overflow-wrap:anywhere]">
      <span className="font-semibold">반려 사유:</span> {reason}
    </div>
  )
}
