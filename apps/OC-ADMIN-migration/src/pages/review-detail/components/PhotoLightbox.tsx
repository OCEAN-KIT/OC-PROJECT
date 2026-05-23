import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect } from 'react'

type PhotoLightboxProps = {
  photos: string[]
  index: number
  onClose: () => void
  onChangeIndex: (index: number) => void
}

export function PhotoLightbox({
  photos,
  index,
  onClose,
  onChangeIndex,
}: PhotoLightboxProps) {
  const prev = useCallback(
    () => onChangeIndex((index - 1 + photos.length) % photos.length),
    [index, onChangeIndex, photos.length],
  )
  const next = useCallback(
    () => onChangeIndex((index + 1) % photos.length),
    [index, onChangeIndex, photos.length],
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') prev()
      if (event.key === 'ArrowRight') next()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [next, onClose, prev])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </button>

      <div className="absolute left-1/2 top-4 -translate-x-1/2 text-sm text-white/70">
        {index + 1} / {photos.length}
      </div>

      {photos.length > 1 && (
        <button
          type="button"
          className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          onClick={(event) => {
            event.stopPropagation()
            prev()
          }}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      <img
        src={photos[index]}
        alt={`photo-${index + 1}`}
        className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
        onClick={(event) => event.stopPropagation()}
      />

      {photos.length > 1 && (
        <button
          type="button"
          className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          onClick={(event) => {
            event.stopPropagation()
            next()
          }}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}
