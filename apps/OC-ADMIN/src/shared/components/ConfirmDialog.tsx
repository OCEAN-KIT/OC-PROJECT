import { useEffect, useRef } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { LoadingSpinner } from './LoadingSpinner'

type ConfirmDialogVariant = 'danger' | 'default'

type ConfirmDialogProps = {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  variant?: ConfirmDialogVariant
  onConfirm: () => void
  onClose: () => void
}

const variantClasses: Record<
  ConfirmDialogVariant,
  {
    icon: string
    confirmButton: string
  }
> = {
  danger: {
    icon: 'bg-rose-50 text-rose-600 ring-rose-100',
    confirmButton:
      'bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-200',
  },
  default: {
    icon: 'bg-[#2C67BC]/10 text-[#2C67BC] ring-[#2C67BC]/10',
    confirmButton:
      'bg-[#2C67BC] text-white hover:bg-[#255aa7] focus:ring-[#2C67BC]/20',
  },
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  loading = false,
  variant = 'default',
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null)
  const classes = variantClasses[variant]

  useEffect(() => {
    if (!open) {
      return
    }

    cancelButtonRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [loading, onClose, open])

  if (!open) {
    return null
  }

  return (
    <div
      aria-modal="true"
      role="alertdialog"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      className="fixed inset-0 z-[220] flex items-center justify-center px-4"
    >
      <button
        type="button"
        aria-label="닫기"
        disabled={loading}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/45 backdrop-blur-sm disabled:cursor-not-allowed"
      />

      <div className="relative z-10 w-full max-w-[420px] rounded-xl border border-gray-100 bg-white text-gray-900 shadow-2xl">
        <button
          type="button"
          aria-label="닫기"
          disabled={loading}
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-6 pb-5 pt-6">
          <div
            className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full ring-1 ${classes.icon}`}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>

          <h2
            id="confirm-dialog-title"
            className="break-words text-base font-semibold"
          >
            {title}
          </h2>
          <p
            id="confirm-dialog-description"
            className="mt-2 break-words text-sm leading-6 text-gray-600"
          >
            {description}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-gray-100 px-6 py-4">
          <button
            ref={cancelButtonRef}
            type="button"
            disabled={loading}
            onClick={onClose}
            className="min-h-9 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`inline-flex min-h-9 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50 ${classes.confirmButton}`}
          >
            {loading && <LoadingSpinner size={14} color="#fff" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
